import { Tabs } from 'antd';
import { Offline, Online } from 'react-detect-offline';
import { useEffect } from 'react';
// import { sessionId } from '../../service/data-service';
import { getSessionId } from '../../service/localStorage.service';
import Error from '../ui/error/Error';
import { MoviesList } from '../movies-list';
import './App.css';
import { MoviesRatedList } from '../movies-rated-list';
import { useDispatch, useSelector } from 'react-redux';
import {
  getQuery,
  getCurrentPage,
  getGanres,
  sessionId,
  getMovies,
  getGanresList,
} from '../../store/movies';

export function App() {
  const dispatch = useDispatch();
  const currentPage = useSelector(getCurrentPage());
  const query = useSelector(getQuery());
  const ganres = useSelector(getGanresList());

  useEffect(() => {
    if (!getSessionId()) {
      dispatch(sessionId());
    }

    // Проверяем, есть ли уже ganres в сторе
    if (!ganres) {
      // Если ganres еще не загружены, вызываем действие getGanres
      dispatch(getGanres());
    }

    // Вызываем getMovies после того, как ganres загружены
    dispatch(getMovies(query, currentPage));
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
      children: <h2>Hello</h2>,
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
