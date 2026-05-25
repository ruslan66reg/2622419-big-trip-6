import {render} from '../framework/render.js';
import SortView, {SortType} from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import {sortPointByPrice, sortPointByTime, sortPointByDay} from '../utils/sort.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;

  #eventListComponent = new EventListView();
  #sortComponent = null; // Убрали new SortView() отсюда
  #noPointComponent = new NoPointView();

  #boardPoints = [];
  #boardDestinations = [];

  #pointPresenters = new Map();
  #currentSortType = SortType.DAY; // Сортировка по умолчанию

  constructor({boardContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.getPoints()];
    this.#boardDestinations = [...this.#pointsModel.getDestinations()];

    // При старте приложения сортируем точки по дням
    this.#boardPoints.sort(sortPointByDay);

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

  #sortPoints(sortType) {
    // В зависимости от типа сортировки применяем нужную функцию
    switch (sortType) {
      case SortType.TIME:
        this.#boardPoints.sort(sortPointByTime);
        break;
      case SortType.PRICE:
        this.#boardPoints.sort(sortPointByPrice);
        break;
      case SortType.DAY:
      default:
        this.#boardPoints.sort(sortPointByDay);
    }
    // Запоминаем текущую сортировку
    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    // Если пользователь кликнул по текущей сортировке — ничего не делаем
    if (this.#currentSortType === sortType) {
      return;
    }

    // Сортируем точки
    this.#sortPoints(sortType);

    // Очищаем старый список
    this.#clearPointList();

    // Рисуем новый отсортированный список
    this.#renderPoints();
  };

  #renderSort() {
    // Создаем компонент сортировки с передачей колбэка
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });
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
