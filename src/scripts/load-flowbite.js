import "flowbite";
document.addEventListener("astro:after-swap", () => {
  import("flowbite").then((flowbite) => {
    flowbite.initFlowbite();
  });
});