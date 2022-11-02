import React from 'react';
import {Image, Nav} from 'react-bootstrap';
import NavElement from "../components/NavElement";
import {useRouter} from "next/router";
import {useRoutes} from "dashboard/contexts/routes";
import {useConfig} from "dashboard/contexts/config";

export default function Sidebar() {
  // hooks
  const routes = useRoutes();
  const router = useRouter();
  const config = useConfig();
  // render
  return (
    <>
      <div className={'Sidebar large d-none d-lg-block'}>
        <div className='Logo'>
          <Image src={config.sidebarLogoLarge?.src || ''} alt='Logo large' />
        </div>
        <hr />
        <Nav className='flex-column' activeKey={router.asPath}>
          <NavElement routes={routes || []} showIcon={true} showText={true} className='nav-link' />
        </Nav>
        <hr />
      </div>
      <div className={'Sidebar small d-none d-sm-block d-lg-none'}>
        <div className='Logo'>
          <Image src={config.sidebarLogoSmall?.src || ''} alt='Logo small' />
        </div>
        <hr />
        <Nav className='flex-column'>
          <NavElement routes={routes || []} showIcon={true} showText={false} className='nav-link' />
        </Nav>
        <hr />
      </div>
    </>
  );

}
