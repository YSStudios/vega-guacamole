export default function parallaxEffect(){

  //Selectors
  const card = document.querySelector("#vega_bg");
  const container = document.querySelector("#bg_container");
  const cube = document.querySelector("#testdiv");
  //Items

  //Moving Animation Event
  container.addEventListener("mousemove", (e) => {
    let xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    let yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    container.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
  });

  //Animate In
  container.addEventListener("mouseenter", (e) => {
    card.style.transition = "none";
    //Popout


  });

  //Animate Out
  container.addEventListener("mouseleave", (e) => {
    container.style.transition = "all 0.1s ease";
    container.style.transform = `rotateY(0deg) rotateX(0deg)`;
    //Popback

  });
};