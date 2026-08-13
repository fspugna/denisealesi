import MainMenu from "./MainMenu";

export const Header = () => {
    return (
        <header className="z-50 bg-[#1c1d26]/80 backdrop-blur-md w-full px-6 pt-8 pb-18 flex justify-between items-center border-b border-white/10 transition-all">
            <MainMenu />
        </header>
    );
}