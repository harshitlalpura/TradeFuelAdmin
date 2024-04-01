import HospitalLayout from 'layouts/Hospital.jsx';
import MusicLayout from 'layouts/Music.jsx';
import SocialLayout from 'layouts/Social.jsx';
import CrmLayout from 'layouts/Crm.jsx';
import FreelanceLayout from 'layouts/Freelance.jsx';
import GeneralLayout from 'layouts/General.jsx';
import CustomLayout from 'layouts/Custom.jsx';
import UniversityLayout from 'layouts/University.jsx';
import EcommerceLayout from 'layouts/Ecommerce.jsx';
import BlogLayout from 'layouts/Blog.jsx';
import BlankPage from 'layouts/BlankPage.jsx';
import LoginPage from 'layouts/LoginPage.jsx';

import DefaultLayout from 'layouts/PageLayouts/DefaultLayout.jsx';
import FoldedMenu from 'layouts/PageLayouts/FoldedMenu.jsx';
import TransparentLayout from 'layouts/PageLayouts/TransparentLayout.jsx';
import LightMenu from 'layouts/PageLayouts/LightMenu.jsx';
import ChatOpen from 'layouts/PageLayouts/ChatOpen.jsx';
import Layout1 from 'layouts/PageLayouts/Layout1.jsx';
import Layout2 from 'layouts/PageLayouts/Layout2.jsx';
import Layout3 from 'layouts/PageLayouts/Layout3.jsx';
import Layout4 from 'layouts/PageLayouts/Layout4.jsx';
import Layout5 from 'layouts/PageLayouts/Layout5.jsx';
import Layout6 from 'layouts/PageLayouts/Layout6.jsx';
import Layout7 from 'layouts/PageLayouts/Layout7.jsx';
import Layout8 from 'layouts/PageLayouts/Layout8.jsx';
import Layout9 from 'layouts/PageLayouts/Layout9.jsx';
import Layout10 from 'layouts/PageLayouts/Layout10.jsx';
import Layout11 from 'layouts/PageLayouts/Layout11.jsx';
import Layout12 from 'layouts/PageLayouts/Layout12.jsx';
import Layout13 from 'layouts/PageLayouts/Layout13.jsx';
import Layout14 from 'layouts/PageLayouts/Layout14.jsx';
import Layout15 from 'layouts/PageLayouts/Layout15.jsx';
import Subscriptions from "../views/custom/Subscriptions/Subscriptions";
import ManageSubscriptionPlan from "../views/custom/Subscriptions/ManageSubscriptionPlan";

var BASEDIR = process.env.REACT_APP_BASEDIR;

var indexRoutes = [




    {path: BASEDIR + "/dashboard", name: "Dashboard", component: GeneralLayout, authentication:true,access:"dashboard"},
    {path: BASEDIR + "/subscriptions", name: "Subscriptions", component: GeneralLayout, authentication:true,access:"subscriptions"},
    {path: BASEDIR + "/plans", name: "Subscription Plans", component: GeneralLayout, authentication:true,access:"admins"},
    {path: BASEDIR + "/createplan", name: "Create Subscription Plan", component: CustomLayout, authentication:true,access:"subscriptions"},
    {path: BASEDIR + "/transactions", name: "Transactions", component: GeneralLayout, authentication:true,access:"transactions"},
    {path: BASEDIR + "/viewtransaction", name: "View Transactions", component: CustomLayout, authentication:true,access:"transactions"},
    {path: BASEDIR + "/settings/paymentgateway", name: "Payment Gateway Settings", component: GeneralLayout, authentication:true,access:"settings"},
    {path: BASEDIR + "/settings/stockmarket", name: "Stock Market API Settings", component: GeneralLayout, authentication:true,access:"settings"},
    {path: BASEDIR + "/settings/contactus", name: "Contact Us Settings", component: GeneralLayout, authentication:true,access:"settings"},
    {path: BASEDIR + "/settings/maintenance", name: "Maintenance Settings", component: GeneralLayout, authentication:true,access:"settings"},
    {path: BASEDIR + "/feedbacks", name: "Feedbacks", component: GeneralLayout, authentication:true,access:"feedbacks"},
    {path: BASEDIR + "/banners", name: "Banners", component: GeneralLayout, authentication:true,access:"banners"},
    {path: BASEDIR + "/admins", name: "Banners", component: GeneralLayout, authentication:true,access:"admins"},
    {path: BASEDIR + "/banner", name: "Manage Banner", component: CustomLayout, authentication:true,access:"banners"},
    {path: BASEDIR + "/admin", name: "Manage Admin", component: CustomLayout, authentication:true,access:"admins"},
    {path: BASEDIR + "/notifications", name: "Notifications", component: GeneralLayout, authentication:true,access:"notifications"},
    {path: BASEDIR + "/users", name: "Users", component: GeneralLayout, authentication:false,access:"users"},
    {path: BASEDIR + "/news", name: "News", component: GeneralLayout, authentication:false,access:"news"},
    {path: BASEDIR + "/managenews", name: "Manage News", component: CustomLayout, authentication:false,access:"news"},
    {path: BASEDIR + "/learn", name: "Learn", component: GeneralLayout, authentication:false,access:"learn"},
    {path: BASEDIR + "/managelearn", name: "Manage Learn", component: CustomLayout, authentication:false,access:"learn"},
    {path: BASEDIR + "/profile", name: "User Profile", component: CustomLayout, authentication:false,access:"users"},
    {path: BASEDIR + "/footer", name: "Footer", component: GeneralLayout, authentication:false,access:"footer"},


    {path: BASEDIR + "/", name: "Login", component: LoginPage, authentication:false},
    {path:  "/", name: "Login", component: LoginPage, authentication:false},
];

export default indexRoutes;
