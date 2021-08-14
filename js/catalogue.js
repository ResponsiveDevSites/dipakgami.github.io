var sheetAPIBaseURL = "https://sheets.googleapis.com/v4/spreadsheets"
var ExcelfileID = "1ydx9B9s00Jp_Q0PNjQOLERtUC-eAYm6S5_VKBDvBdwA";
var apiKey = "AIzaSyALYSx_H8_qXnLRJvuql7GzfTZ3MvlLdqI";

/*Read categories*/
var categorySheetName = "Categories";
var categoryFromRange = "A1";
var categoryToRange = "A12";

var readCategoryURL = sheetAPIBaseURL + "/" + ExcelfileID + "/values/" + categorySheetName + "!" + categoryFromRange + ":" + categoryToRange + "?key=" + apiKey;
/*Read categories ends*/

/*Read products*/
var productSheetName = "Products";
var productFromRange = "A1";
var productToRange = "E12";
var readProductURL = sheetAPIBaseURL + "/" + ExcelfileID + "/values/" + productSheetName + "!" + productFromRange + ":" + productToRange + "?key=" + apiKey;
/*Read products ends*/

/*Read products*/
var productVariantsSheetName = "ProductVariants";
var productVariantsFromRange = "A1";
var productVariantsToRange = "F15";
var readProductVariantsURL = sheetAPIBaseURL + "/" + ExcelfileID + "/values/" + productVariantsSheetName + "!" + productVariantsFromRange + ":" + productVariantsToRange + "?key=" + apiKey;
/*Read products ends*/

var categoryResult = null;
var productResult = null;
var productVariantsResult = null;

$(document).ready(function () {

    //fetch categories and products from local storage
    categoryResult = JSON.parse(localStorage.getItem("categoryResult"));
    productResult = JSON.parse(localStorage.getItem("productResult"));
    productVariantsResult = JSON.parse(localStorage.getItem("productVariantsResult"));

    if (categoryResult == null || categoryResult == '') {
        getCategoriesAjax();
    }
    else {
        loadMenuCategories(categoryResult);
        loadSearchCategories(categoryResult);
        loadProductsSideBarCategories(categoryResult);
        loadMobileViewMenuCat(categoryResult);
    }
    if (productResult == null || productResult == '') {
        getProductsAjax();
    }
    else {
        loadFeaturedProducts(productResult);
        loadProducts(productResult);
    }

    if (productVariantsResult == null || productVariantsResult == '') {
        getProductVariantsAjax();
    } else {
        loadProductDetails();
    }

    $("#txtSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#productBlock .col-6").filter(function () {
            $(this).toggle($(this).find('.product-title a').text().toLowerCase().indexOf(value) > -1)
        });
    });

    $('.RAM').on('ifClicked', function (event) {
        $('.RAM').iCheck('uncheck');
        $(this).iCheck('check');
    });
    $('.Thickness').on('ifClicked', function (event) {
        $('.Thickness').iCheck('uncheck');
        $(this).iCheck('check');
    });
    $('#colorFilterOptions li').on('click', function (event) {
        $('#colorFilterOptions li').not(this).removeClass('active');
        $(this).addClass('active');
    });


});

function refreshData() {
    getCategoriesAjax();
    getProductsAjax();
    getProductVariantsAjax();
   
}

function getCategoriesAjax() {

    $.ajax({
        type: "GET",
        url: readCategoryURL,
        cache: false,
        dataType: "json",
        success: function (data) {
            categoryResult = data.values.slice(1); //removed first row. it contains column title
            localStorage.setItem("categoryResult", JSON.stringify(categoryResult));
            loadMenuCategories(categoryResult);
            loadSearchCategories(categoryResult);
            loadProductsSideBarCategories(categoryResult);
            loadMobileViewMenuCat(categoryResult);
        }
    });
}
function getProductsAjax() {

    $.ajax({
        type: "GET",
        url: readProductURL,
        cache: false,
        dataType: "json",
        success: function (data) {
            productResult = data.values.slice(1); //removed first row. it contains column title
            localStorage.setItem("productResult", JSON.stringify(productResult));
            loadFeaturedProducts(productResult);
            loadProducts(productResult);
        }
    });

}
function getProductVariantsAjax() {
    $.ajax({
        type: "GET",
        url: readProductVariantsURL,
        cache: false,
        dataType: "json",
        success: function (data) {
            productVariantsResult = data.values.slice(1); //removed first row. it contains column title
            localStorage.setItem("productVariantsResult", JSON.stringify(productVariantsResult));
            loadProductDetails();
            window.location.href = "products.html";
        }
    });

}

/** Home page scripts**/

function loadMenuCategories(categories) {
    let catPart1 = "<li><a href='products.html'>All Categories</a></li>";
    let catPart2 = '';
    let partition = Math.round((categories.length / 2));

    for (let i = 0; i < partition; i++) {
        catPart1 += "<li><a href='products.html?category=" + categories[i] + "'>" + categories[i] + "</a></li>";
    }
    for (let j = partition; j < categories.length; j++) {
        catPart2 += "<li><a href='products.html?category=" + categories[j] + "'>" + categories[j] + "</a></li>";
    }
    $('#catPart1').html(catPart1);
    $('#catPart2').html(catPart2);
}
function loadSearchCategories(categories) {
    let ddlOptions = "<option value=''>All Categories</option>";
    for (let i = 0; i < categories.length; i++) {
        ddlOptions += "<option value=''>" + categories[i] + "</option>";
    }
    $('#searchCat').html(ddlOptions);
}

/** Product page scripts**/

function loadMobileViewMenuCat(categories) {
    let mobileViewMenuCat = '';
    for (let i = 0; i < categories.length; i++) {
        let encodedURL = encodeURIComponent(categories[i]);
        mobileViewMenuCat += "<li><a href='products.html?category=" + encodedURL + "'>" + categories[i] + "</a></li>";
        $('#mobileViewMenuCat').html(mobileViewMenuCat);
    }
}
function loadProductsSideBarCategories(categories) {
    let sidebarCat = "<li><a href='products.html'>All Categories</a></li>";
    for (let i = 0; i < categories.length; i++) {
        let encodedURL = encodeURIComponent(categories[i]);
        sidebarCat += "<li><a href='products.html?category=" + encodedURL + "'>" + categories[i] + "</a></li>";
    }
    $('#sidebarCat').html(sidebarCat);
}

function loadProducts(products) {

    var locationValue = (new URL(location.href)).searchParams.get('category')
    if (locationValue != null) {

        products = products.filter(function (obj) {
            return (obj[0] === locationValue)
        });
    }
    let productBlock = '';
    for (let i = 0; i < products.length; i++) {
        productBlock += '<div class="col-6 col-sm-4"><div class="product-default inner-quickview inner-icon"><figure><a onclick="navigateToProductDetails(\'' + products[i][1] + '\')\" href="javascript:"><img src="ProductImages/' + products[i][3] + '"></a><a href="javascript:" class="btn-quickview" onclick="quickView(\'' + products[i][1] + '\')" title="Quick View">Quick View</a></figure><div class="product-details"><div class="category-wrap"><div class="category-list"><a href="javascript:" class="product-category">' + products[i][0] + '</a></div></div><h3 class="product-title"><a onclick="navigateToProductDetails("' + products[i][1] + '")" href="javascript:">' + products[i][2] + '</a></h3></div></div></div>';

    }
    $('#productBlock').html(productBlock);
}
function loadFeaturedProducts(products) {
    let featuredProductBlock = '';
    for (let i = 0; i < 8; i++) {
        let product = products[Math.floor(Math.random() * products.length)];
        featuredProductBlock += '<div class="product-default inner-quickview inner-icon"><figure><a href="productdetails.html?ProductID=' + products[1] + '"><img src="ProductImages/' + product[3] + '"></a><a href="javascript:" class="btn-quickview" onclick="quickView(\'' + product[1] + '\')"  title="Quick View">Quick View</a> </figure> <div class="product-details"> <div class="category-wrap"> <div class="category-list"> <a href="javascript:" class="product-category">' + product[0] + '</a> </div> </div> <h3 class="product-title"> <a href="productdetails.html">' + product[2] + '</a> </h3>  </div></div>';
    }

    $('#featuredProductBlock').html(featuredProductBlock);

    var newSliderOptions = {
        "loop": false,
        "margin": 20,
        "responsiveClass": true,
        "nav": false,
        "navText": [
            "<i class=\"icon-angle-left\">",
            "<i class=\"icon-angle-right\">"
        ],
        "dots": true,
        "autoplay": false,
        "autoplayTimeout": 15000,
        "items": 2,
        "responsive": {
            "576": {
                "items": 3
            },
            "992": {
                "items": 4
            }
        }
    };
    $('#featuredProductBlock').addClass('products-slider owl-carousel');
    $('#featuredProductBlock').owlCarousel(newSliderOptions);

}

function quickView(productID) {
    let product = productResult.filter(function (obj) {
        return (obj[1] === productID)
    });

    $('#quickViewProductImage').attr('src', 'ProductImages/' + product[0][3]);
    $('#quickViewProductName').html(product[0][2]);
    $('#quickViewProductDescription').html(product[0][4]);
    $('#quickView').modal('show');
}

function navigateToProductDetails(productID) {
    localStorage.setItem("selectedProductID", productID);
    window.location.href = "productdetails.html";
}
function loadProductDetails() {

    let productID = localStorage.getItem("selectedProductID");

    if (productID != null) {
        let product = productResult.filter(function (obj) {
            return (obj[1] === productID)
        });
        let productDetails = productVariantsResult.filter(function (obj) {
            return (obj[0] === productID)
        });
        $('#productDetailImage').attr('src', 'ProductImages/' + product[0][3]);
        $('#productDetailProductName').html(product[0][2]);
        $('#productDetailProductDescription').html(product[0][4]);

        let colorBlock = '';
        let thicknessBlock = '';
        let ramCapacityBlock = '';
        productDetails.filter(function (obj) {
            if (obj[3] == "Color") {
                colorBlock += '<li><div style="padding:2px;"><a href="javascript:" title="' + obj[4] + '" style="background-color:' + obj[2] + '"></a></div></li>';
            }
            if (obj[3] == "Thickness") {
                thicknessBlock += '<div class="custom-control custom-checkbox"><input type="checkbox" class="' + obj[3] + '" id="' + obj[3] + "_" + obj[2] + '" value="' + obj[3] + '"><label style="margin-left: 5px;" for="' + obj[3] + "_" + obj[2] + '">' + obj[4] + '</label> </div>';
            }
            if (obj[3] == "RAM") {
                ramCapacityBlock += '<div class="custom-control custom-checkbox"><input type="checkbox" class="' + obj[3] + '" id="' + obj[3] + "_" + obj[2] + '" value="' + obj[3] + '"><label style="margin-left: 5px;" for="' + obj[3] + "_" + obj[2] + '">' + obj[4] + '</label> </div>';
            }
        });

        if (colorBlock != '') {
            $('#colorFilterOptions').html(colorBlock);
        }
        if (thicknessBlock != '') {
            $('#thicknessOptions').after(thicknessBlock);
        }
        if (ramCapacityBlock != '') {
            $('#ramCapacityOptions').after(ramCapacityBlock);
        }

    }
}