const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const createElements = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.children;
};

const render = (container, elements, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      for (let i = elements.length - 1; i >= 0; i--) {
        container.prepend(elements[i]);
      }
      break;
    case RenderPosition.BEFOREEND:
      for (let elem of elements) {
        container.append(elem);
      }
      break;
  }
};

export {createElements, render, RenderPosition};
