import { Tabs } from 'antd';
import { Offline, Online } from 'react-detect-offline';
import { useEffect } from 'react';
import { sessionId } from '../../service/data-service';
import { getSessionId } from '../../service/localStorage.service';
import Error from '../ui/error/Error';
import { MoviesList } from '../movies-list';
import './App.css';
import { MoviesRatedList } from '../movies-rated-list';

export function App() {
  useEffect(() => {
    if (!getSessionId()) {
      sessionId();
    }
  }, []);

  const items = [
    {
      label: 'Movies List',
      key: '1',
      children: <MoviesList />,
    },
    {
      label: 'Rated Movies',
      key: '2',
      children: <MoviesRatedList />,
    },
  ];

  return (
    <div className='app'>
      <Online>
        <div className='wrapper container'>
          <Tabs
            defaultActiveKey='1'
            centered
            items={items}
            destroyInactiveTabPane
            size='large'
          />
        </div>
      </Online>
      <Offline>
        <div className='offline-message-area container'>
          <Error />
        </div>
      </Offline>
    </div>
  );
}
