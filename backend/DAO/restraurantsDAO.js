let restaurants;

export default class RestaurantsDAO {
  static async inject(conn) {
    if (restaurants) {
      return;
    }
    try {
      restaurants = await conn
        .db(process.env.RESTREVIEWS_NS)
        .collection("restaurants");
    } catch (e) {
      console.error(`Failed to established the connection ${e}`);
    }
  }
  static async getRestaurants({
    filter = null,
    page = 0,
    restaurantsPerPage = 20,
  } = {}) {
    let query;
    if (filter) {
      if ("name" in filter) {
        query = { $text: { $search: filter["name"] } };
      } else if ("cuisine" in filter) {
        query = { cuisine: { $eq: filter["cuisine"] } };
      } else if ("zipcode" in filter) {
        query = { zipcode: { $eq: filter["zipcode"] } };
      }
    }
    let cursor;
    try {
      cursor = await restaurants.find(query);
    } catch (error) {
      console.error(`Unable to find this command`);
      return {
        restaurantsList: [],
        totalNumRestaurants: 0,
      };
    }
    const displayCursor = cursor
      .limit(restaurantsPerPage)
      .skip(restaurantsPerPage * pageSize);
    try {
      const restaurantsList = await displayCursor.toArray();
      const totalNumRestaurants = restaurants.countDocuments(query);
    } catch (error) {
      console.error(`Unable to find this command`);
      return {
        restaurantsList: [],
        totalNumRestaurants: 0,
      };
    }
  }
}
