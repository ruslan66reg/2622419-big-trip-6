import {render} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;

  #eventListComponent = new EventListView();
  #sortComponent = new SortView();
  #noPointComponent = new NoPointView();

  #boardPoints = [];
  #boardDestinations = [];

  #pointPresenters = new Map();

  constructor({boardContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.getPoints()];
    this.#boardDestinations = [...this.#pointsModel.getDestinations()];

    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = this.#boardPoints.map((point) =>
      point.id === updatedPoint.id ? updatedPoint : point
    );
    const destination = this.#boardDestinations.find((dest) => dest.id === updatedPoint.destination);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint, destination);
  };

  #renderSort() {
    render(this.#sortComponent, this.#boardContainer);
  }

  #renderNoPoints() {
    render(this.#noPointComponent, this.#boardContainer);
  }

  #renderPoint(point, destination) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point, destination);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    for (let i = 0; i < this.#boardPoints.length; i++) {
      const destination = this.#boardDestinations.find((dest) => dest.id === this.#boardPoints[i].destination);
      this.#renderPoint(this.#boardPoints[i], destination);
    }
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderBoard() {
    if (this.#boardPoints.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    render(this.#eventListComponent, this.#boardContainer);
    this.#renderPoints();
  }
}
