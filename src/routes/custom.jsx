import General from 'views/custom/Dashboard/General.jsx';
import Hospital from 'views/hospital/Dashboard/Hospital.jsx';
import Music from 'views/music/Dashboard/Music.jsx';
import Crm from 'views/crm/Dashboard/Crm.jsx';
import Social from 'views/social/Dashboard/Social.jsx';
import Freelance from 'views/freelance/Dashboard/Freelance.jsx';
import University from 'views/university/Dashboard/University.jsx';
import Ecommerce from 'views/ecommerce/Dashboard/Ecommerce.jsx';
import Blog from 'views/blog/Dashboard/Blog.jsx';
import GeneralOld from 'views/general/Dashboard/General.jsx';
import Dashboard2 from 'views/general/Dashboard/Dashboard2.jsx';
import Dashboard3 from 'views/general/Dashboard/Dashboard3.jsx';
import Dashboard4 from 'views/general/Dashboard/Dashboard4.jsx';
import Dashboard5 from 'views/general/Dashboard/Dashboard5.jsx';
import Dashboard6 from 'views/general/Dashboard/Dashboard6.jsx';
import Dashboard7 from 'views/general/Dashboard/Dashboard7.jsx';
import Dashboard8 from 'views/general/Dashboard/Dashboard8.jsx';
import Dashboard9 from 'views/general/Dashboard/Dashboard9.jsx';


import Maps from 'views/general/Maps/Maps.jsx';
import UIVectorMap from 'views/general/Maps/VectorMap.jsx';

import Calendar from 'views/general/Calendar/Calendar.jsx';

import Mailinbox from 'views/general/Mail/Inbox.jsx';
import Mailcompose from 'views/general/Mail/Compose.jsx';
import Mailview from 'views/general/Mail/View.jsx';

import Widgetsmisc from 'views/general/Widgets/Misc.jsx';
import Widgetscountertiles from 'views/general/Widgets/CounterTiles.jsx';
import Widgetsprogresstiles from 'views/general/Widgets/ProgressTiles.jsx';
import Widgetssocialmedia from 'views/general/Widgets/SocialMedia.jsx';
import Widgetsloops from 'views/general/Widgets/Loops.jsx';

import Chartjsline from 'views/general/Chartjs/Line.jsx';
import Chartjsbar from 'views/general/Chartjs/Bar.jsx';
import Chartjspolar from 'views/general/Chartjs/Polar.jsx';
import Chartjspie from 'views/general/Chartjs/Pie.jsx';
import Chartjsradar from 'views/general/Chartjs/Radar.jsx';
import Chartjsdoughnut from 'views/general/Chartjs/Doughnut.jsx';
import Chartjsscatter from 'views/general/Chartjs/Scatter.jsx';
import Chartjsbubble from 'views/general/Chartjs/Bubble.jsx';
import Chartjshorizontalbar from 'views/general/Chartjs/Horizontalbar.jsx';

import FormElements from 'views/general/Forms/Elements.jsx';
import ManageSubscriptionPlan from "../views/custom/Subscriptions/ManageSubscriptionPlan";
import ViewTransaction from "../views/custom/Transactions/ViewTransaction";
import ManageBanners from "../views/custom/Banners/ManageBanners";
import Login from "../views/custom/Login";
import ManageAdmin from "../views/custom/Admins/ManageAdmin";
import UserProfile from "../views/custom/Users/UserProfile";
import ManageNews from "../views/custom/News/ManageNews";
import ManageLearn from "../views/custom/Learn/ManageLearn";


var BASEDIR = process.env.REACT_APP_BASEDIR;

var customRoutes = [

    //{ path: "#", name: "Main", type: "navgroup"},
    /* { path: BASEDIR+"/dashboard", name: "Dashboard", icon: "dashboard", badge: "", component: General },*/

    {path: BASEDIR + "/createplan", name: "Create Subscription Plan", component: ManageSubscriptionPlan},
    {path: BASEDIR + "/viewtransaction", name: "View Transaction", component: ViewTransaction},
    {path: BASEDIR + "/banner", name: "Create Banner", component: ManageBanners},
    {path: BASEDIR + "/managenews", name: "Create News", component: ManageNews},
    {path: BASEDIR + "/managelearn", name: "Create Learn", component: ManageLearn},
    {path: BASEDIR + "/admin", name: "Admin", component: ManageAdmin},
    {path: BASEDIR + "/profile", name: "User Profile", component: UserProfile},
    {path: BASEDIR + "/login", name: "Login", component: Login},
    {path: BASEDIR + "/", name: "Login", component: Login},


];
export default customRoutes;
