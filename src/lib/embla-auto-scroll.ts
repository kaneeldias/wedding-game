import EmblaCarousel, {EmblaCarouselType} from 'embla-carousel';
import {EngineType} from 'embla-carousel/components/Engine';
import {CreatePluginType} from 'embla-carousel/components/Plugins';
import {ScrollBodyType} from 'embla-carousel/components/ScrollBody';

//
// THIS IS A COPY/PASTA FROM THE BELOW LINK TO MAKE MANTINE AND AUTOSCROLL WORK TOGETHER WITH EMBLA CAROUSEL.
// https://github.com/davidjerleke/embla-carousel/blob/master/packages/embla-carousel-auto-scroll/src/components/AutoScroll.ts
//
// Mantine requires a specific version of Embla Carousel ^7.1.0 which is a verison incompatible with the auto-scroll plugin.
// Some modifications were made in order to get it scrolling nicely.
//
import {CreateOptionsType} from 'embla-carousel/components/Options';

export type OptionsType = CreateOptionsType<{
    direction: 'forward' | 'backward';
    speed: number;
    startDelay: number;
    playOnInit: boolean;
    stopOnFocusIn: boolean;
    stopOnInteraction: boolean;
    stopOnMouseEnter: boolean;
    rootNode: ((emblaRoot: HTMLElement) => HTMLElement | null) | null;
}>;

export const defaultOptions: OptionsType = {
    direction: 'forward',
    speed: 2,
    startDelay: 1000,
    active: true,
    breakpoints: {},
    playOnInit: true,
    stopOnFocusIn: true,
    stopOnInteraction: true,
    stopOnMouseEnter: false,
    rootNode: null,
};

declare module 'embla-carousel/components/Plugins' {
    interface EmblaPluginsType {
        autoScroll?: AutoScrollType;
    }
}

declare module 'embla-carousel/components/EventHandler' {
    interface EmblaEventListType {
        autoScrollPlay: 'autoScroll:play';
        autoScrollStop: 'autoScroll:stop';
    }
}

export type AutoScrollType = CreatePluginType<
    {
        play: (delay?: number) => void;
        stop: () => void;
        reset: () => void;
        isPlaying: () => boolean;
    },
    OptionsType
>;

export type AutoScrollOptionsType = AutoScrollType['options'];

function AutoScroll(userOptions: Partial<AutoScrollOptionsType> = {}): AutoScrollType {
    let options: OptionsType;
    let emblaApi: EmblaCarouselType;
    let destroyed: boolean;
    let playing = false;
    let resume = true;
    let defaultScrollBehaviour: ScrollBodyType;
    
    const optionsHandler = EmblaCarousel.optionsHandler();
    const optionsBase = optionsHandler.merge(defaultOptions, AutoScroll.globalOptions);
    
    function init(emblaApiInstance: EmblaCarouselType): void {
        emblaApi = emblaApiInstance;
        
        const {merge: mergeOptions, atMedia: optionsAtMedia} = optionsHandler;
        const allOptions = mergeOptions(optionsBase, userOptions);
        options = optionsAtMedia(allOptions);
        
        if (emblaApi.scrollSnapList().length <= 1) return;
        
        destroyed = false;
        defaultScrollBehaviour = emblaApi.internalEngine().scrollBody;
        
        const {eventStore} = emblaApi.internalEngine();
        const emblaRoot = emblaApi.rootNode();
        const root = (options.rootNode && options.rootNode(emblaRoot)) || emblaRoot;
        const container = emblaApi.containerNode();
        
        emblaApi.on('pointerDown', stopScroll);
        
        if (!options.stopOnInteraction) {
            emblaApi.on('pointerUp', startScrollOnSettle);
        }
        
        if (options.stopOnMouseEnter) {
            eventStore.add(root, 'mouseenter', () => {
                resume = false;
                stopScroll();
            });
            
            if (!options.stopOnInteraction) {
                eventStore.add(root, 'mouseleave', () => {
                    resume = true;
                    startScroll();
                });
            }
        }
        
        if (options.stopOnFocusIn) {
            eventStore.add(container, 'focusin', () => {
                stopScroll();
                emblaApi.scrollTo(emblaApi.selectedScrollSnap(), true);
            });
            
            if (!options.stopOnInteraction) {
                eventStore.add(container, 'focusout', startScroll);
            }
        }
        
        if (options.playOnInit) startScroll();
    }
    
    function destroy(): void {
        emblaApi
        .off('pointerDown', stopScroll)
        .off('pointerUp', startScrollOnSettle)
        .off('settle', onSettle);
        
        stopScroll();
        destroyed = true;
        playing = false;
    }
    
    function startScroll(): void {
        if (destroyed || playing) return;
        if (!resume) return;
        
        const engine = emblaApi.internalEngine();
        engine.scrollBody = createAutoScrollBehaviour(engine);
        engine.animation.start();
        
        playing = true;
    }
    
    function stopScroll(): void {
        if (destroyed || !playing) return;
        
        const engine = emblaApi.internalEngine();
        engine.scrollBody = defaultScrollBehaviour;
        
        playing = false;
    }
    
    function onSettle(): void {
        if (resume) startScroll();
        emblaApi.off('settle', onSettle);
    }
    
    function startScrollOnSettle(): void {
        emblaApi.on('settle', onSettle);
    }
    
    function createAutoScrollBehaviour(engine: EngineType): ScrollBodyType {
        const {
            location,
            target,
            scrollTarget,
            index,
            indexPrevious,
            limit: {reachedMin, reachedMax, constrain},
            options: {loop},
        } = engine;
        const directionSign = options.direction === 'forward' ? -1 : 1;
        const noop = (): ScrollBodyType => self;
        
        let bodyVelocity = 0;
        let scrollDirection = 0;
        let rawLocation = location.get();
        let rawLocationPrevious = 0;
        let hasSettled = false;
        
        function seek(): ScrollBodyType {
            let directionDiff = 0;
            
            bodyVelocity = directionSign * options.speed;
            rawLocation += bodyVelocity;
            location.add(bodyVelocity);
            target.set(location);
            
            directionDiff = rawLocation - rawLocationPrevious;
            scrollDirection = Math.sign(directionDiff);
            rawLocationPrevious = rawLocation;
            
            const currentIndex = scrollTarget.byDistance(0, false).index;
            
            if (index.get() !== currentIndex) {
                indexPrevious.set(index.get());
                index.set(currentIndex);
            }
            
            const reachedEnd =
                options.direction === 'forward' ? reachedMin(location.get()) : reachedMax(location.get());
            
            if (!loop && reachedEnd) {
                hasSettled = true;
                const constrainedLocation = constrain(location.get());
                location.set(constrainedLocation);
                target.set(location);
                stopScroll();
            }
            
            return self;
        }
        
        const self: ScrollBodyType = {
            direction: () => scrollDirection,
            settle: () => hasSettled,
            update: () => null,
            useBaseSpeed: noop,
            useBaseMass: noop,
            useSpeed: noop,
            useMass: noop,
            seek,
        };
        
        return self;
    }
    
    function play(): void {
        resume = true;
        startScroll();
    }
    
    function stop(): void {
        if (playing) stopScroll();
    }
    
    function reset(): void {
        if (playing) {
            stopScroll();
            startScrollOnSettle();
        }
    }
    
    function isPlaying(): boolean {
        return playing;
    }
    
    const self: AutoScrollType = {
        name: 'autoScroll',
        options: optionsHandler.merge(optionsBase, userOptions),
        init,
        destroy,
        play,
        stop,
        reset,
        isPlaying,
    };
    
    return self;
}

AutoScroll.globalOptions = <AutoScrollOptionsType | undefined>undefined;

export default AutoScroll;
