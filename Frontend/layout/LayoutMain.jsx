import { Outlet } from "react-router-dom"
import { Header } from "./Header"

export const LayoutMain = () => {
    return (
        <>
            <Header />
            <section className="layout__content">
                <Outlet />
            </section>
        </>

    )
}
