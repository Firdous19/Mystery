import Navbar from '@/components/Navbar';

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    return (
        <div>
            {/* <Navbar /> */}
            {children}
        </div>
    );
}