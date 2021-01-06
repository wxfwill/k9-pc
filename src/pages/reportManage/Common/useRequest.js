import React, {useState, useEffect} from 'react';

function useRequest() {
  const [teamData, setTeamData] = useState([]);
  useEffect(() => {
    const queryAllTeam = async () => {
      await React.httpAjax('post', config.apiUrl + '/api/userCenter/queryAllGroups').then((res) => {
        if (res.code == 0) {
          try {
            const resObj = res.data;
            const newArr = [];
            for (const key in resObj) {
              const obj = {id: key, name: resObj[key]};
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

export {useRequest};
