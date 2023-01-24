gsap.registerPlugin("GSDevTools");
//const { selector } = require("gsap");

function init() {
  // welcome to the projects gallery
  gsap.set(".projects", { autoAlpha: 1 });
  gsap.set(".project", { x: "-100%" });

  let currentStep = 0;
  const totalSlides = document.querySelectorAll(".project").length;
  const wrapper = gsap.utils.wrap(0, totalSlides);

  createTimelineIn("next", currentStep);

  function createTimelineIn(direction, index) {
    const goPrev = direction === "prev";

    const element = document.querySelector("div.project0" + index);

    projectClasses = element.className.split(" "); //gran truco para seleccionar el primer elemento y hacerlo versatil
    projectClass = projectClasses[1];
    title = element.querySelector(".project-title");
    subtitle = element.querySelector(".project-subtitle");
    button = element.querySelector(".button-container");

    const tlIn = gsap.timeline({
      id: "tlIn",
      defaults: {
        modifiers: {
          x: gsap.utils.unitize(function (x) {
            return goPrev ? Math.abs(x) : x;
          }),
        },
      },
    });
    tlIn
      .fromTo(
        element,
        {
          autoAlpha: 0,
          x: "-100%",
        },
        {
          duration: 0.7,
          x: 0,
          autoAlpha: 1,
          onStart: updateClass,
          onStartParams: [projectClass],
        }
      )
      .from([title, subtitle, button], {
        duration: 0.2,
        x: -20,
        autoAlpha: 0,
        stagger: 0.1,
      });
    return tlIn;
  }

  function createTimelineOut(direction, index) {
    const goPrev = direction === "prev";

    const element = document.querySelector("div.project0" + index);
    const tlOut = gsap.timeline();

    tlOut.to(element, {
      duration: 0.7,
      x: 250,
      autoAlpha: 0,
      modifiers: {
        x: gsap.utils.unitize(function (x) {
          return goPrev ? -x : x;
        }),
      },
      ease: "back.in(2)",
    });
    return tlOut;
  }

  //   function getGoToIndex(direction, index) {
  //     let goToIndex = index;
  //     if (direction === "next") {
  //       goToIndex = index < totalSlides ? index + 1 : 1;
  //     } else {
  //       goToIndex = index > 1 ? index - 1 : totalSlides;
  //     }
  //     return goToIndex;
  //   }

  function updateCurrentStep(goToIndex) {
    currentStep = goToIndex;
    document.querySelectorAll(".dot").forEach(function (element, index) {
      element.setAttribute("class", "dot");
      if (index === currentStep) {
        element.classList.add("active");
      }
    });
    positionDot();
  }

  function transition(direction, toIndex) {
    const tlOut = createTimelineOut(direction, currentStep); //y luego traes el siguiente
    const tlIn = createTimelineIn(direction, toIndex); //esto es por que tiene que empezar saliendo la animacion

    const tlTransition = gsap.timeline({
      onStart: function () {
        console.log({ fromIndex: currentStep }, { toIndex });
        updateCurrentStep(toIndex);
      },
    });
    tlTransition.add(tlOut).add(tlIn);

    return tlTransition;
  }

  function isTweening() {
    //funcion para ver si esta ocurriendo alguna animacion en el momento
    return gsap.isTweening(".project");
  }

  document.querySelector("button.next").addEventListener("click", function (e) {
    e.preventDefault();
    // const isLast = currentStep === totalSlides;
    const nextStep = wrapper(currentStep + 1);
    !isTweening() && transition("next", nextStep);
  });

  document.querySelector("button.prev").addEventListener("click", function (e) {
    e.preventDefault();

    // const isFirst = currentStep === 0;
    const prevStep = wrapper(currentStep - 1);
    !isTweening() && transition("prev", prevStep);
  });

  function updateClass(projectClass) {
    document.querySelector("body").className = projectClass;
  }

  function createNavigation() {
    //create dots container
    const newDiv = document.createElement("div");
    newDiv.setAttribute("class", "dots");

    //add active spot
    const spot = document.createElement("div");
    spot.setAttribute("class", "spot");

    //create a dot for each slide
    for (let index = 0; index < totalSlides; index++) {
      const element = document.createElement("button");
      const text = document.createTextNode(index);
      element.appendChild(text);
      element.setAttribute("class", "dot");
      if (currentStep === index) {
        element.classList.add("active");
      }

      element.addEventListener("click", function () {
        if (!isTweening() && currentStep !== index) {
          const direction = index > currentStep ? "next" : "prev";
          transition(direction, index);
        }
      });
      newDiv.appendChild(element);
    }

    //add dots to the projects container
    newDiv.appendChild(spot);
    document.querySelector(".projects").appendChild(newDiv);
    positionDot();
  }

  function positionDot() {
    const activeDotX = document.querySelector(".dot.active").offsetLeft;
    const spot = document.querySelector(".spot");
    const spotX = spot.offsetLeft;
    const destinationX = Math.round(activeDotX - spotX + 5);

    const dotTl = gsap.timeline();
    dotTl
      .to(spot, {
        duration: 0.4,
        x: destinationX,
        scale: 2.5,
        ease: "power1.Out",
      })
      .to(spot, {
        duration: 0.2,
        scale: 1,
        ease: "power1.in",
      });
  }
  createNavigation();
  GSDevTools.create({ id: "tlIn" });
}

window.addEventListener("load", function () {
  init();
});
