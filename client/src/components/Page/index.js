import React from "react"
import CustomHeader from "../CustomHeader/CustomHeader"
import Footer from "../Footer"
import {Route, Switch} from "react-router-dom";
import Home from "../../pages/Home";
import Contacts from "../../pages/Contacts";
import Dashboard from "../../pages/Dashboard";
import SettingsMain from "../../pages/Settings/Main";
import SettingsSecurity from "../../pages/Settings/Security";
import SettingsNotifications from "../../pages/Settings/Notifications";
import Admin from "../../pages/Admin";
import AdminSettings from "../../pages/Admin/Settings";
import AdminUsers from "../../pages/Admin/Users";
import AdminPages from "../../pages/Admin/Pages";
import AdminPayments from "../../pages/Admin/Payments";
import {LEGAL_LINKS, MENU} from "../../Config";
import StaticPage from "../../pages/StaticPage";
import NotFound from "../../pages/NotFound";
import FAQ from "../../pages/FAQ/FAQ";


export default class extends React.Component {
    render() {
        return (
            <>
                <CustomHeader />
				<main>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/contacts" component={Contacts}/>
                        <Route exact path="/faq" component={FAQ}/>
                        <Route path="/dashboard" component={Dashboard}/>
                        <Route exact path="/settings" component={SettingsMain}/>
                        <Route exact path="/settings/security" component={SettingsSecurity}/>
                        <Route exact path="/settings/notifications" component={SettingsNotifications}/>
                        <Route exact path="/admin" component={Admin}/>
                        <Route exact path="/admin/settings" component={AdminSettings}/>
                        <Route exact path="/admin/users" component={AdminUsers}/>
                        <Route exact path="/admin/users/requests" component={AdminUsers}/>
                        <Route exact path="/admin/pages" component={AdminPages}/>
                        <Route exact path="/admin/payments" component={AdminPayments}/>
                        {MENU.map((page, i) => !page.notStatic ? <Route exact path={page.to} component={StaticPage} key={i}/> :'')}
                        {LEGAL_LINKS.map((page, i) => !page.notStatic? <Route exact path={page.to} component={StaticPage} key={i}/> :'')}
                        <Route path="*" component={NotFound}/>
                    </Switch>
                </main>
                <Footer />
            </>
        )
    }
}
