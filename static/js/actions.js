// URLs to get the movies
let url_get_comedy_movies = 'http://localhost:8000/api/v1/titles/?genre=comedy&sort_by=imdb_score';
let url_get_animation_movies = 'http://localhost:8000/api/v1/titles?sort_by=imdb_score&genre=animation';
let url_get_family_movies = 'http://localhost:8000/api/v1/titles?sort_by=imdb_score&genre=family';
let url_get_best_movies = 'http://localhost:8000/api/v1/titles?sort_by=imdb_score';
const movies_html_class = document.getElementsByClassName("movies");

// modal and content variables
var modal = document.getElementById("myModal");
var close_btn = document.getElementById("close_modal_button");
var movie_info_left = document.getElementById("movie_info_left");
var movie_cover_in_modal = document.getElementById("movie_cover_in_modal");
var movie_description_in_modal = document.getElementById("movie_description");
var play_best_movie = document.getElementById("best_movie_button");

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
        this.long_description = "";
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
    constructor(url_start,length, rank_in_html) {
        return (async () => {
        this.url_start = url_start;
        this.length = length
        this.nb_pages = 0;
        this.urls_movies = [];
        this.movies = [];
        this.section = movies_html_class[rank_in_html];
        this.right_arrow = "";
        this.left_arrow = "";
        this.movies_displayed = [];
        await this.getLastPagesFromAPI();
        await this.set_all_movies_info();
        this.basic_display()
        return this;
        })();
    }


    display_next_movies () {
        const children = this.section.children;
        let m = 0;
        for (let i=1; i< children.length - 1 ; i++) {
                if (this.movies.length ==7){
                    m = i + 2 ;
                } else {
                    m = i + 3;
                }
            children[i].innerHTML = "<button class='movie'><img src=" + this.movies[m].image_url + " alt='' /></button>";
            let movie = this.movies[m];
            children[i].addEventListener('click',function(){
                modify_popUp_content(movie)
            })
        }
        this.right_arrow.style.visibility = 'hidden'
        this.left_arrow.style.visibility = 'visible'
    }

    basic_display()     {
        const children = this.section.children;
        this.left_arrow = children[0];
        this.right_arrow = children[5];
        this.left_arrow.style.visibility = 'hidden';
        this.right_arrow.style.visibility = 'visible';
        let m = 0;
        for (let i=1; i< children.length - 1 ; i++) {
                if (this.movies.length ==7){
                    m = i -1 ;
                } else {
                    m = i;
                }
            children[i].innerHTML = "<button class='movie'><img src=" + this.movies[m].image_url + " alt='' /></button>";
            let movie = this.movies[m];
            children[i].addEventListener('click',function(){
                modify_popUp_content(movie)
            })
        }
    }

    async set_all_movies_info() {
        for (let index=0; index < this.urls_movies.length; index++){
            const movie = new Movie(this.urls_movies[index])
            await movie.set_info()
            this.movies.push(movie)
        }
    }

    async getLastPagesFromAPI() {
    var data = await this.getRawInfoFromApi(this.url_start)
    this.nb_pages = Math.ceil(data.count/data.results.length);
    let url = this.transform_url(this.url_start, this.nb_pages);
    var data2 = await this.getRawInfoFromApi(url);
    let urls_to_get = this.length;
    var data3 = await this.check_if_last_page(data2)
    await this.get_all_urls_movies(data3);
    }

    async get_all_urls_movies(data) {
        this.loopToGetUrlsFromPage(data);
        if (this.check_if_get_all_urls_movies()) {
        } else {
           var info = await this.getRawInfoFromApi(data.previous);
           return this.get_all_urls_movies(info)
        }
    }

    check_if_get_all_urls_movies(){
    if (this.urls_movies.length < this.length) {
        let count = this.length - this.urls_movies.length;
        return false
    } else {
        return true
    }
    }

    async check_if_last_page(pageJson) {
    if (pageJson.next == null) {
        return pageJson
    } else {
        let data = await this.getRawInfoFromApi(pageJson.next)
        return check_if_last_page(data)
    }
    }

    loopToGetUrlsFromPage(pageJson) {
    let urls = [];
    let urls_count = this.length - this.urls_movies.length;
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
}

    async getRawInfoFromApi(url){
        const response = await fetch(url);
        var data = await response.json();
        return data
    }

    transform_url(url,nb_pages) {
        return url + '&page=' + nb_pages;
}

}

close_btn.onclick = function() {
  modal.style.display = "none";
}

function modify_popUp_content(movie){
    let info_movie_left = "<ul>";
    const info_movie_dico = {Titre: movie.title, Genre: movie.genres, 'Score imdb': movie.imdb_score, Durée: movie.duration + "minutes", 'Date de sortie': movie.year,
     Pays: movie.countries, Réalisateurs: movie.directors, Acteurs: movie.actors, Rated: movie.rated, 'Résultat au box ofice': movie.worldwide_gross_income};
    for (const [key, value] of Object.entries(info_movie_dico)) {
        var line = "<li><strong>" + key + "</strong>: " + value + "</li>";
        info_movie_left = info_movie_left.concat(line);
    }
    info_movie_left = info_movie_left + "</ul>"
    movie_cover_in_modal.innerHTML = "<div id='movie_cover_in_modal'><img alt='' title='' src=" + movie.image_url + "></div>";
    movie_info_left.innerHTML = "<div id='movie_info_in_modal'>" + info_movie_left + "</div>";
    movie_description_in_modal.innerHTML = '<div id="movie_description"><strong>Description: </strong>' + movie.long_description + '</div>'
    modal.style.display = "block";


}

function best_movie_display(movie_category) {
    const best_movie_cover = document.getElementById("best_movie_cover");
    const best_movie_title = document.getElementById("best_movie_title");
    const best_movie_description = document.getElementById("best_movie_description");
    best_movie_cover.innerHTML = "<div id='best_movie_cover'><img src=" + movie_category.movies[0].image_url + " alt='' /></div>";
    best_movie_title.innerHTML = "<div id='best_movie_title'><strong>" + movie_category.movies[0].title + "</strong></div>";
    best_movie_description.innerHTML = "<div id='best_movie_description'><strong>Description: </strong>" + movie_category.movies[0].long_description + "</div>";
}

async function main() {
    const category_best = await new Categories(url_get_best_movies,8,0);
    category_best.left_arrow.onclick = function() {
        category_best.basic_display();

    }
    category_best.right_arrow.onclick = function() {
        category_best.display_next_movies();
    }

    best_movie_display(category_best);
    best_movie_button.onclick = function() {
        modify_popUp_content(category_best.movies[0]);
    }

    const category_comedy = await new Categories(url_get_comedy_movies,7,1);
    category_comedy.left_arrow.onclick = function() {
        category_comedy.basic_display();

    }
    category_comedy.right_arrow.onclick = function() {
        category_comedy.display_next_movies();
    }

    const category_family = await new Categories(url_get_family_movies,7,2);
    category_family.left_arrow.onclick = function() {
        category_family.basic_display();

    }
    category_family.right_arrow.onclick = function() {
        category_family.display_next_movies();
    }

    const category_animation = await new Categories(url_get_animation_movies,7,3);
    category_animation.left_arrow.onclick = function() {
        category_animation.basic_display();

    }
    category_animation.right_arrow.onclick = function() {
        category_animation.display_next_movies();
    }
}

main()


