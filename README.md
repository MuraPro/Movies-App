Визуальная часть: https://incomparable-dragon-0545b4.netlify.app/

1 constructor
2 update
3 render
4 componetnDidMount (запросы к Api, библиотеки) - дом эл уже на странице и они инициализированны
5 render
6 update
7 render
8 componentWillUnmount
9 upadate
10 render

Mounting: constructor => render => componentDidMount
Updates: (new props / setState) => render => componentDidUpdate(prevProps, prevState)
можно запрашивать новые данные для обновленных свойств
Unmounting: componentWillUnmount
Error: componentDidCatch - обработка не пойманых ошибок в других методах жизненого цикла
componentDidCatch() {
this.setState({error: true})
}

this.movieService.getRatedMovies(page).then((data) => {
this.setState({
ratedMovies: data.results.map((movie) => ({
title: movie.original_title,
description: movie.overview,
average: movie.vote_average.toFixed(1),
posterImage: movie.poster_path
? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
: null,
date: movie.release_date,
id: movie.id,
genreIds: movie.genre_ids,
})),
loading: false,
totalDataItems: data.total_results,
});
});
