import React, { useState, useEffect } from 'react';

function useRequest() {
  const [teamData, setTeamData] = useState([]);
  useEffect(() => {
    let queryAllTeam = async () => {
      await React.httpAjax('post', config.apiUrl + '/api/userCenter/queryAllGroups').then((res) => {
        if (res.code == 0) {
          try {
            let resObj = res.data;
            let newArr = [];
            for (let key in resObj) {
              let obj = { id: key, name: resObj[key] };
              newArr.push(obj);
            }
            setTeamData(newArr);
          } catch (error) {}
        }
      });
    };
    queryAllTeam();
  }, []);
  return teamData;
}

export { useRequest };
