import React from "react";
import {Image} from "react-bootstrap";

export interface AvatarProps {
  name : string;
  avatar : string | null;
}

export function Avatar({name, avatar}:AvatarProps) {

  return (
    <span className='Avatar'>
      <span>{name}</span>
      <span>
        <Image src={avatar || ''} alt='avatar' />
      </span>
    </span>
  )
}
