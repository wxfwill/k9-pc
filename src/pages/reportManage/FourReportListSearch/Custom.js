import React from 'react';
import {useRequest} from '../Common/useRequest.js';

export default function Custom() {
  const teamData = useRequest();
  console.log('自定义hooks');
  console.log(teamData);
  return <div>自定义hooks</div>;
}
