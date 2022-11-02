import React from 'react';
import {WithChildren} from "types/withChildren";
import Topbar from "./Topbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

function Dashboard({onOpenKiosk, children} : WithChildren & { onOpenKiosk: () => void }) {

  // normal mode
  return (
    <div className='Dashboard'>
      <div className='Main'>
        <Topbar onOpenKiosk={onOpenKiosk}/>
        <div className='Content'>
          <div className='InnerContent'>{children}</div>
          <Footer />
        </div>
      </div>
      <Sidebar />
    </div>
  );

}

export default Dashboard;
