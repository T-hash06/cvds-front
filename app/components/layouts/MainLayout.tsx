import { Outlet } from "@remix-run/react";
import type { FC, ReactNode } from "react";
import Navbar from "../navbar/navbarUser";
import Sidebar from "../sidebar/Sidebar";
import CustomScrollbar from "../custom-scrollbar/CustomScrollbar";

interface MainLayoutProps {
	children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
	return (
		<div className="main-layout">
			<Navbar />
			<div style={{ display: "flex", height: "100vh" }}>
				<Sidebar />
				<main style={{ flex: 1 }}>
					<CustomScrollbar height="100%">
						<Outlet />
						{children}
					</CustomScrollbar>
				</main>
			</div>
		</div>
	);
};

export default MainLayout;
