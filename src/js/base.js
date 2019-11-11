window.addEventListener('DOMContentLoaded', function () {
  console.log('DOM fully loaded and parsed');

  var firebaseCollectionTakenNames = '/takenNames';

  var firebaseConfig = {
    apiKey: "AIzaSyCwcAl3HsqVrseehYCS4G7kCaOTN657AHI",
    authDomain: "christmas-game-74fda.firebaseapp.com",
    databaseURL: "https://christmas-game-74fda.firebaseio.com",
    projectId: "christmas-game-74fda",
    storageBucket: "christmas-game-74fda.appspot.com",
    messagingSenderId: "895583215631",
    appId: "1:895583215631:web:ba056c8ce864854904437a"
  };

  var alreadyTakenDummyClass = "already-taken-dummy-class";
  var avatarClassName = "avatar";
  var hiddenClassName = "hidden";
  var allAvatarsElement = document.getElementById("all-avatars");
  var loadingElement = document.getElementById("loading");
  var lsName = "christmas-game-2019-clicked-on-name";

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var addTakenName = function (name) {
    firebase
      .database()
      .ref(firebaseCollectionTakenNames)
      .once('value')
      .then(function (snapshot) {
        var value = snapshot.val();
        if (!snapshot.val()) {
          value = [];
        }
        value[value.length] = name;
        // Set new value in DB
        firebase
          .database()
          .ref(firebaseCollectionTakenNames)
          .set(value)
      });
  };

  var findCardContentChild = function (children) {
    var cardContentChild = null;
    children.forEach(function (child) {
      if (child.className && child.className !== "" && child.className.indexOf("card-content") > -1) {
        cardContentChild = child;
      }
    });
    return cardContentChild;
  };

  var addLineThroughOnAllPChildElements = function (element) {
    element.childNodes.forEach(function (child) {
      if (child.tagName && child.tagName === "P") {
        child.classList.add("line-through");
      }
    });
  };

  var checkIfAlreadyTaken = function (element, firebaseNames) {
    var locallySelected = element.className && element.className.indexOf(alreadyTakenDummyClass) !== -1;
    var firebaseSelected = firebaseNames && firebaseNames.indexOf(element.id) !== -1;
    return locallySelected || firebaseSelected;
  };

  var addAlreadyTakenClassToElement = function (element) {
    element.classList.add(alreadyTakenDummyClass);
  };

  var haveAlreadyClickedOnAName = function () {
    return localStorage.getItem(lsName) === "true";
  };

  var setHaveClickedOnAName = function () {
    localStorage.setItem(lsName, "true");
  };

  var getOnClickEventListenerFn = function (element, name) {
    return function () {
      var cardContentEl = findCardContentChild(element.childNodes);
      if (cardContentEl) {
        addLineThroughOnAllPChildElements(cardContentEl);
        addAlreadyTakenClassToElement(element);

        addTakenName(name);

        setHaveClickedOnAName();
      }
    }
  };

  var setNoOpOnClickOnElement = function (element) {
    // The avatar is already chosen, add a no-op method on click so it replaces a possible existing click method
    element.onclick = function () {};
  };

  /* Initialization */
  // Listen to takenNames collection
  firebase
    .database()
    .ref(firebaseCollectionTakenNames)
    .on('value', function (snapshot) {
      allAvatarsElement.classList.remove(hiddenClassName);
      loadingElement.classList.add(hiddenClassName);

      var avatarElements = document.getElementsByClassName(avatarClassName);

      for (var i = 0, len = avatarElements.length; i < len; i++) {
        var element = avatarElements[i];

        if (!checkIfAlreadyTaken(element, snapshot.val())) {
          var name = element.id;
          if (!haveAlreadyClickedOnAName()) {
            element.onclick = getOnClickEventListenerFn(element, name);
          } else {
            setNoOpOnClickOnElement(element);
          }
        } else {
          var cardContentEl = findCardContentChild(element.childNodes);
          addLineThroughOnAllPChildElements(cardContentEl);
          addAlreadyTakenClassToElement(element);
          setNoOpOnClickOnElement(element);
        }
      }
    });
});
