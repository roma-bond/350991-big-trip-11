const RenderPosition = {
  BEFORE: `before`,
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`,
  AFTER: `after`
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const render = (container, component, place) => {
  switch (place) {
    case RenderPosition.BEFORE:
      container.before(component.getElement());
      break;
    case RenderPosition.AFTER_BEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.BEFORE_END:
      container.append(component.getElement());
      break;
    case RenderPosition.AFTER:
      container.after(component.getElement());
      break;
  }
};

const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = parentElement && newElement && oldElement;

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

const removeChildrenElements = (element) => {
  Array.from(element.children).forEach((childElement) => childElement.remove());
};

export {RenderPosition, createElement, render, replace, remove, removeChildrenElements};
