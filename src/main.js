import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

const headerElement = document.querySelector('.page-header');
const filtersElement = headerElement.querySelector('.trip-controls__filters');
const eventsElement = document.querySelector('.trip-events');
const newEventButtonComponent = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const handleNewPointFormClose = () => {
  newEventButtonComponent.disabled = false;
};

const boardPresenter = new BoardPresenter({
  boardContainer: eventsElement,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersElement,
  filterModel,
  pointsModel
});

newEventButtonComponent.addEventListener('click', (evt) => {
  evt.preventDefault();
  boardPresenter.createPoint();
  newEventButtonComponent.disabled = true;
});

filterPresenter.init();
boardPresenter.init();
