const NotificationDto = require('../dtos/NotificationDto');
const ErrorHandler = require('../exceptions/ErrorHandler');
const NotificationModel = require('../models/Notification');


class NotificationService {

    
    async getNotificationsForUser(user_id, limit, page) {
        console.log(`Get notifications for user with id ${user_id} with limit: ${limit}, page: ${page}`);

        if (limit && limit < 0) {
            throw ErrorHandler.BadRequest("Limit should be more than 0");
        }
        if (page && page < 0) {
            throw ErrorHandler.BadRequest('Page should be more than 0');
        }

        if(!limit) {
            limit = 20;
        }
        if(!page) {
            page = 0;
        }

        page++;
        const notifications = await NotificationModel.find({user_id: user_id})
            .skip(page > 0 ? ((page - 1) * limit) : 0)
            .limit(limit)
            .sort({ date: -1 });

        const notificationsDto = [];
        for(var i = 0; notifications[i]; i++) {
            notifications[i].viewed = true;
            notifications[i].save();
            notificationsDto.push(new NotificationDto(notifications[i]));
        }

        const total = await NotificationModel.countDocuments({user_id});
        
        return {notifications: notificationsDto, total};
    }
}

module.exports = new NotificationService();