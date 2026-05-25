import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({url: 'points'}).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'}).then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'}).then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #adaptToServer(point) {
    const adaptedPoint = {
      'base_price': Number(point.basePrice) || 0,
      'date_from': point.dateFrom ? new Date(point.dateFrom).toISOString() : new Date().toISOString(),
      'date_to': point.dateTo ? new Date(point.dateTo).toISOString() : new Date().toISOString(),
      'destination': typeof point.destination === 'object' ? point.destination?.id : point.destination,
      'is_favorite': Boolean(point.isFavorite),
      'offers': Array.isArray(point.offers) ? point.offers.map((offer) => typeof offer === 'object' ? offer.id : offer) : [],
      'type': point.type,
    };

    // Отправляем ID только если он реально есть (при редактировании).
    if (point.id) {
      adaptedPoint.id = point.id;
    }

    return adaptedPoint;
  }
}
