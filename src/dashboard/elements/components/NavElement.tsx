import React from "react";
import {NavItem, NavLink} from "react-bootstrap";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {RouteType} from "dashboard/types/route";

interface PropsI {
  routes: RouteType[];
  showIcon: boolean;
  showText: boolean;
  className?: string;
}

export default function NavElement({routes, showIcon, showText, className}: PropsI) {
  return (
    <>
      {routes.map((element) => (
        <Link key={element.label} href={'/' + element.label} >
          <NavItem>
            <NavLink eventKey={'/' + element.label} as='a' className={className}>
              <span className='navIcon'>{ showIcon && <FontAwesomeIcon icon={element.icon} /> }</span>
              { showText && element.title }
            </NavLink>
          </NavItem>
        </Link>
      ))}
    </>
  );
}
