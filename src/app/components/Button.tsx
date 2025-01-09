type Props = {
    children: React.ReactNode;
}

export default function Button(props: Props) {
    return (
        <button
            className={`mt-10 flex bg-white bg-opacity-50 rounded-md p-2 px-4 text-emerald-800 font-bold hover:text-white hover:bg-emerald-800 transition-all`}>
            {props.children}
        </button>
    );
}