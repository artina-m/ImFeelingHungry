// will hold csv data
var data;

function createSelectedCard(d) {
    // console.log("entering createSelectedCard");
    // console.log(d);
    // Input: Array of resturant info
    var linkedCard = document.createElement("a")
    linkedCard.href = d.url;
    linkedCard.target = "_blank"
    linkedCard.className = "linkedCard"

    var card = document.createElement("div");
    card.className = "selectedCard";
    card.id = d.name;

    // Photo
    var restPhoto = document.createElement("div")
    restPhoto.id = "r_photo";

    var photo = document.createElement("img")
    photo.className = "photo"
    photo.src = d.img_url;
    restPhoto.appendChild(photo)

    // Details
    var restInfo = document.createElement("div")
    restInfo.id = "r_info";

    var para = document.createElement("p");
    para.id = "r_name"
    var rest_name = document.createTextNode(d.name);
    para.appendChild(rest_name);
    restInfo.appendChild(para);

    // Get only first uppercase element of category types
    var catArray = [];
    d.categories.forEach(function (c) {
        c.forEach(function (cat) {
            catArray.push(" " + cat[0])
        })
    })

    var para = document.createElement("p");
    para.id = "r_cat"
    var rest_cat = document.createTextNode(catArray);
    para.appendChild(rest_cat);
    restInfo.appendChild(para)

    var para = document.createElement("p");
    para.id = "r_stars"
    var rest_stars = document.createTextNode("Rating:  " + d.rating);
    para.appendChild(rest_stars);
    restInfo.appendChild(para)

    var para = document.createElement("p");
    para.id = "r_dollars"
    var rest_dollars = document.createTextNode("Price Range:  " + d.dollar_sign);
    para.appendChild(rest_dollars);
    restInfo.appendChild(para)

    var para = document.createElement("p");
    para.id = "r_count"
    var rest_count = document.createTextNode("Review Count:  " + d.review_count);
    para.appendChild(rest_count);
    restInfo.appendChild(para)


    // Create card
    card.appendChild(restPhoto)
    card.appendChild(restInfo)
    linkedCard.appendChild(card)
    document.getElementById("underLid").appendChild(linkedCard)

}

// 2d array to flat array
function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}
// check if search category is in this restaurants categories
function isInArray(arr, match_term) {
    let total_array = flatten(arr);
    return total_array.includes(match_term);

}
//remove and return element from array
function remove(array, element) {
    const index = array.indexOf(element);
    var item = array.splice(index, 1);
    return item;
}

// theres duplicate rows in the data, this will eliminate them
function removeDuplicates(arr, prop) {
    var obj = {};
    for (var i = 0, len = arr.length; i < len; i++) {
        if (!obj[arr[i][prop]]) obj[arr[i][prop]] = arr[i];
    }
    var newArr = [];
    for (var key in obj) newArr.push(obj[key]);
    return newArr;
}


// process each row on load
function cleanse_row(row) {
    return {
        categories: JSON.parse("[" + row.categories + "]"),
        dollar_sign: row.dollar_sign,
        dollar_text: row.dollar_text,
        img_url: row.image_url,
        latitude: Number(row.latitude),
        location: JSON.parse(row.location),
        longitude: Number(row.longitude),
        name: row.name,
        neighborhood: (typeof row.neighborhood == "undefined" || row.neighborhood == "") ? "NULL" : row.neighborhood,
        rating: Number(row.rating),
        review_count: Number(row.review_count),
        search_category: (typeof row.search_category == "undefined") ? "NULL" : row.search_category,
        snippet_text: row.snippet_text,
        url: row.url
    };
};

// filters based on 'categories', 'dollar_sign', 'neighborhood'. 
// returns array of matched restaurant objects
function filter_search(data, category_filter, price_filter_arr, neighborhood_filter, ) {
    console.log(category_filter, price_filter_arr, neighborhood_filter);

    var filtered = data.filter(function (row) {
        // for 'Any' search on neighborhood
        if (neighborhood_filter == "ANY") {
            if (
                isInArray(row.categories, category_filter) &&
                price_filter_arr.includes(row.dollar_sign)
            ) { return row };
        }
        // for search with 3 inputted catgeories
        else {
            // works via an 'and' search
            if (
                isInArray(row.categories, category_filter) &&
                price_filter_arr.includes(row.dollar_sign) &&
                (row.neighborhood == neighborhood_filter || row.neighborhood == "NULL")) { return row };
        }
    });
    // drop duplicatess in the data
    var pos = removeDuplicates(filtered, "name");
    // return cards or no match
    if (pos.length < 1){return zero_matches()} else{return pos}
};


// returns random restaurant from an array
function randomRestaurant(restaurant_arr){
    return restaurant_arr[(Math.floor(Math.random() * restaurant_arr.length))]; 
}


// // used in dynamic generation of catgeories

// function combine(multiarr) {
//     return multiarr.map((arr) => arr.map((y) => y[1]));
// };

// function uniqueCategories(data){

//     // this is a 2d array of all categories
//     var allCategories= data.reduce(function (keeper, entry) {
//         return keeper.concat(combine(entry.categories));
//     }, []);

//     // determine unique categories, return as Set of categories
//     let set = new Set([].concat.apply([], allCategories));

//     return Array.from(set);
// }

// these can be dynanmically generated with the functions above, but as they're static, might as well save the computation time

const prices = ["$", "$$", "$$$", "$$$$"];

const categories = { "Breakfast & Brunch": "breakfast_brunch", "Burgers": "burgers", "Sandwiches": "sandwiches", "Mexican": "mexican", "Japanese": "japanese", "Italian": "italian", "Pizza": "pizza", "Seafood": "seafood", "Live/Raw Food": "raw_food", "American (New)": "newamerican", "Mediterranean": "mediterranean", "Vegan": "vegan", "Gluten-Free": "gluten_free", "Spanish": "spanish", "Wine Bars": "wine_bars", "Tapas/Small Plates": "tapasmallplates", "Salad": "salad", "Juice Bars & Smoothies": "juicebars", "Vegetarian": "vegetarian", "Indian": "indpak", "Belgian": "belgian", "American (Traditional)": "tradamerican", "Pubs": "pubs", "Korean": "korean", "Asian Fusion": "asianfusion", "Lounges": "lounges", "Coffee & Tea": "coffee", "Cafes": "cafes", "Delis": "delis", "Grocery": "grocery", "Bakeries": "bakeries", "Gastropubs": "gastropubs", "Bars": "bars", "Cocktail Bars": "cocktailbars", "Desserts": "desserts", "French": "french", "Steakhouses": "steak", "Cheese Shops": "cheese", "Sushi Bars": "sushi", "Bubble Tea": "bubbletea", "Vietnamese": "vietnamese", "Caterers": "catering", "Cheesesteaks": "cheesesteaks", "Diners": "diners", "Turkish": "turkish", "Falafel": "falafel", "Pakistani": "pakistani", "Bangladeshi": "bangladeshi", "Himalayan/Nepalese": "himalayan", "Halal": "halal", "Fast Food": "hotdogs", "Hot Pot": "hotpot", "Chinese": "chinese", "Ramen": "ramen", "Mongolian": "mongolian", "Dim Sum": "dimsum", "Cantonese": "cantonese", "Latin American": "latin", "Food Trucks": "foodtrucks", "Thai": "thai", "Ice Cream & Frozen Yogurt": "icecream", "Donuts": "donuts", "Food Stands": "foodstands", "Cupcakes": "cupcakes", "Greek": "greek", "Ethnic Food": "ethnicmarkets", "Armenian": "armenian", "Middle Eastern": "mideastern", "Polish": "polish", "Ukrainian": "ukrainian", "Shopping": "shopping" };

const neighborhoods = ["Financial District", "North End", "Waterfront", "East Boston", "Downtown", "South End", "NULL", "Beacon Hill", "Back Bay", "South Boston", "Chinatown", "Allston/Brighton", "Charlestown", "Kendall Square/MIT", "Dorchester", "Teele Square", "Jamaica Plain", "Inman Square", "Harvard Square", "Fenway", "Mission Hill", "Porter Square", "North Cambridge", "West Roxbury", "Coolidge Corner"];

// Populate category search on keydown
$("#mySearch").autocomplete({
    source: Object.keys(categories)
});

// make the serializeArray into a nicer object
function objectifyForm(formArray) {
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
};

// pick a random restaurant from the CSV 
function generate_random() {
    let random = randomRestaurant(data);
    return random;
};

function remove(array, element) {
    const index = array.indexOf(element);
    var item =  array.splice(index, 1);
    return item[0];
}

// append an empty card if there's no search category inputted
function append_empty_searches(){
    const empty = '<div class="selectedCard" id="Mirisola\'s"><div id="empty_info"><p id="r_name">Please select a Category!</p></div></div>' 
    console.log("appending....");
    $('#underLid').append(empty);
}
// append an empty card if there's no matches 
function zero_matches() {
    $('#underLid').empty()
    const empty = '<div class="selectedCard" id="Mirisola\'s"><div id="empty_info"><p id="r_name">No Matches Found :(</p></div></div>'
    setTimeout(() => {
        $('#underLid').append(empty);    
    }, 650);
    
}


// Load data
d3.csv("yelp_cats_boston.csv", cleanse_row, function (d) {
    data = d;
    var filtered_results;
    // console.log("Cleaned data:");
    // console.log(data)

    // grab inputs from frontend form
    $("form").on("submit", function (event) {
        triggerLid()
        $('#results').empty();
        $('#underLid').empty();
        event.preventDefault();
        var input_searches = objectifyForm($(this).serializeArray());
        
        var price_filters =[]
        $(':checkbox:checked').each(function (i) {
            price_filters[i] = $(this).val();
        });
        // console.log(price_filters);
        input_searches.price_filter = price_filters;

        // if they fail to enter a search_category
        if (input_searches.category_filter == ""){
            setTimeout(() => {
                append_empty_searches()    
            }, 650);
        }else{
            filtered_results = filter_search(data, categories[input_searches.category_filter], input_searches.price_filter, input_searches.neighborhood_filter);

            // this will remove and return a restaurant object, and mutate filtered_results
            var randomly_picked_restuarant = remove(filtered_results, randomRestaurant(filtered_results));
            
            // generate cards on timeout for ~aesthetics
            setTimeout(() => {
                createSelectedCard(randomly_picked_restuarant);
                // Create cards for suggested restuarants
                filtered_results.forEach(element => {
                    createCard(element);
                });
            }, 650);
    }
    });

    // handle random generation
    $("#random_generator").click(function (){
        filtered_results = generate_random();
        triggerLid()
        $('#results').empty();
        $('#underLid').empty();
        $("#mySearch").val("");
        
        setTimeout(() => {
            createSelectedCard(filtered_results)
        }, 650);


    });
});