let url_test = 'http://localhost:8000/api/v1/titles/9'
// URLs to get the movies
let url_get_comedy_movies = 'http://localhost:8000/api/v1/titles/?genre=comedy&sort_by=imdb_score'
let url_get_animation_movies = 'http://localhost:8000/api/v1/titles?sort_by=imdb_score&genre=animation'
let url_get_family_movies = 'http://localhost:8000/api/v1/titles?sort_by=imdb_score&genre=family'
let url_get_best_movies = 'http://localhost:8000/api/v1/titles?sort_by=imdb_score'



// class to define a movie with all the attributs asked by client
class Movie {
    constructor(url) {
        this.url = url
        this.id = "";
        this.image_url = "";
        this.title = "";
        this.genres = "";
        this.year= "";
        this.rated = "";
        this.imdb_score = "";
        this.directors = "";
        this.actors = "";
        this.duration = "";
        this.countries = "";
        this.worldwide_gross_income = "";
        this.description = "";
    }

    async set_info() {
        const response = await fetch(this.url);
        var data = await response.json();
        this.set_attributes(data);
//        this.display_attributes();

    }

    set_attributes(data){
        for (let attribut in this) {
            var value = "";
            Object.keys(data).forEach(function(key) {
                if (attribut == key){
                    value = data[key]
                }
        })
            this[attribut] = value;
        }
    }

    display_attributes() {
    console.log('dans display_attributes() ')
    for (let attribut in this) {
    console.log('attribut = ' + attribut + "   value =  " + this[attribut])
        }
    }
}


class Categories {
    constructor(url_start,length) {
        return (async () => {
        this.url_start = url_start;
        this.length = length
        this.nb_pages = 0;
        this.urls_movies = [];
        this.movies = [];
        await this.getLastPagesFromAPI();
//        console.log('dans constructor apres getLastPagesFromAPI');
        await this.set_all_movies_info();
//        console.log('dans constructor apres set_all_movies_info');
        return this;
        })();
    }

    async set_all_movies_info() {
//        await this.getLastPagesFromAPI();
//        console.log('dans set_all_movies_info()')
        for (let index=0; index < this.urls_movies.length; index++){
//            let data = await this.getRawInfoFromApi(this.urls_movies[index]);
            const movie = new Movie(this.urls_movies[index])
            await movie.set_info()
            this.movies.push(movie)

//            console.log('index = ' + index + '  title = ' + data.title + '  imdb = ' + data.imdb_score)
        }
    }

    async getLastPagesFromAPI() {
//    console.log('dans getLastPagesFromAPI()')
    var data = await this.getRawInfoFromApi(this.url_start)
    this.nb_pages = Math.ceil(data.count/data.results.length);
//    console.log(this.nb_pages, Math.ceil(this.nb_pages));
    let url = this.transform_url(this.url_start, this.nb_pages);
    var data2 = await this.getRawInfoFromApi(url);
    let urls_to_get = this.length;
    var data3 = await this.check_if_last_page(data2)
    await this.get_all_urls_movies(data3);
    }

    async get_all_urls_movies(data) {
//        console.log('dans get_all_urls_movies() ')
        this.loopToGetUrlsFromPage(data);
        if (this.check_if_get_all_urls_movies()) {
            console.log('toutes les urls sont récupérées')
        } else {
//            console.log('dans else')
           var info = await this.getRawInfoFromApi(data.previous);
//           console.log(info.results);
           return this.get_all_urls_movies(info)
        }
//    console.log('fin de get_all_urls_movies : ' + this.urls_movies.length + '   ' + this.urls_movies)
    }

    check_if_get_all_urls_movies(){
//    console.log('dans check_if_get_all_urls_movies: ' + this.urls_movies.length + ' ' +  this.length)
    if (this.urls_movies.length < this.length) {
        let count = this.length - this.urls_movies.length;
//        console.log('il manque ' + count + ' urls');
        return false
    } else {
        return true
    }
    }

    async check_if_last_page(pageJson) {
//    console.log('dans check_if_last_page()')
    if (pageJson.next == null) {
//        console.log('dernière page, il y a ' + pageJson.results.length + ' films')
        return pageJson
//        console.log(data2.results);
    } else {
        let data = await this.getRawInfoFromApi(pageJson.next)
        return check_if_last_page(data)
    }
    }

    loopToGetUrlsFromPage(pageJson) {
//    console.log('dans LoopToGetUrlFromPage : ' + this.length + ' ' + this.urls_movies.length)
    let urls = [];
    let urls_count = this.length - this.urls_movies.length;
//    console.log('urls_count = ' + urls_count)
    for (let index=0; index<pageJson.results.length;index++){
        if (urls_count != 0) {
            urls.push(pageJson.results[index].url);
            urls_count = urls_count -1;
        }
    }
    urls=urls.reverse()
    for (let i in urls){
        this.urls_movies.push(urls[i]);
    }
//    console.log('this_urls_movies = '  + this.urls_movies.length + ' ' + this.urls_movies)
}

    async getRawInfoFromApi(url){
//        console.log('dans getRawInfoFromApi()')
        const response = await fetch(url);
        var data = await response.json();
        return data
    }

    transform_url(url,nb_pages) {
        return url + '&page=' + nb_pages;
}

}


// fonctions tests to be erased or modified at the end of program
function left_arrow() {
console.log('fonction left_arrow OK');
}

function right_arrow() {
console.log('fonction right_arrow OK');
}

function best_movie_display(movie_category) {
    const best_movie_cover = document.getElementById("best_movie_cover");
    const best_movie_title = document.getElementById("best_movie_title");
//    console.log(movie_category.movies[0].image_url, movie_category.movies[0].title);
    best_movie_cover.innerHTML = "<div id='best_movie_cover'><img src=" + movie_category.movies[0].image_url + " alt='' /></div>";
    best_movie_title.innerHTML = "<div id='best_movie_title'>" + movie_category.movies[0].title + "</div>";
}

function basic_display(movie_category, rank) {
    const movies_html_class = document.getElementsByClassName("movies");
//    console.log(movies_html_class)
    display_movies_in_section(movies_html_class[rank], movie_category);
}

function display_movies_in_section(arg, movie_category) {
    const children = arg.children;
    let m = 0;
    for (let i=1; i< children.length - 1 ; i++) {
            if (movie_category.movies.length ==7){
                m = i -1 ;
            } else {
                m = i;
            }
//        console.log(m, movie_category.movies[m].genres, movie_category.movies[m].imdb_score)
        children[i].innerHTML = "<div class='movie'><img src=" + movie_category.movies[m].image_url + " alt='' /></div>"
    }
}

async function main() {
    console.log('début de main...');
    const category_best = await new Categories(url_get_best_movies,8);
    console.log('CATEGORY_BEST SAVED IN CLASS');
    best_movie_display(category_best);
    basic_display(category_best,0);
    const category_comedy = await new Categories(url_get_comedy_movies,7);
    console.log('CATEGORY_COMEDY SAVED IN CLASS');
    basic_display(category_comedy,1);
    const category_family = await new Categories(url_get_family_movies,7);
    console.log('CATEGORY_FAMILY SAVED IN CLASS');
    basic_display(category_family,2);
    const category_animation = await new Categories(url_get_animation_movies,7);
    console.log('CATEGORY_ANIMATION SAVED IN CLASS');
    basic_display(category_animation,3);
    console.log('fin de main....');
}

main()