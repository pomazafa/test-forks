import { Request, Response } from "express";
import { createQueryBuilder, getRepository } from "typeorm";
import { validate } from "class-validator";
import { Container, Service } from "typedi";
import { Fork } from "../entity/Fork";
import RabbitMqService from "../rabbitmq/rabbitmqService";
import { NewForkInCategoryNotification } from "../interfaces/NewForkInCategoryNotification";
import EventEmitter from "../util/eventEmitter";
import { Events } from "../util/types/events.enum";
import { CategorySubscriber } from "../entity/CategorySubscriber";

class CategorySubscriberController {

    constructor() {
        this.initializeEvents();
    }

    private initializeEvents() {
        EventEmitter.on(Events.ForkCreated, async (fork: Fork) => {
            console.log("Fork Created");
            const category = fork.category;
            await this.sendNotification(category.id, fork)
        });
    }

    async sendNotification(categoryId: number, fork: Fork) {
        const rabbitMQInstance = Container.get(RabbitMqService);
        const subscriptions = await CategorySubscriberController.listAll(categoryId);
        for (const subscription of subscriptions) {
            const newFork: NewForkInCategoryNotification = {
                subscriberUsername: subscription.user.username,
                subscriberEmail: subscription.user.email,
                categoryName: subscription.category.name,
            };
            rabbitMQInstance.sendToQueue(JSON.stringify(newFork));
        }
    }


    static listAll = async (id: number) => {
        const query = createQueryBuilder('CategorySubscriber', 's')
            .innerJoin('s.user', 'u')
            .innerJoin('s.category', 'c')
            .select(['s', 'c', 'u.id', 'u.email', 'u.username'])
            .where("c.id = :categoryId", { categoryId: id });
        const categorySubscribers = await query.getMany();
        return categorySubscribers;
    };

    static newCategorySubscriber = async (req: Request, res: Response) => {
        let categorySubscriber = new CategorySubscriber();
        categorySubscriber.user = { id: req.userId };
        categorySubscriber.category = { id: req.params && req.params.id };

        const errors = await validate(categorySubscriber);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const categorySubscriberRepository = getRepository(CategorySubscriber);
        try {
            await categorySubscriberRepository.save(categorySubscriber);
        } catch (e) {
            res.status(409).send("Error occurs while subscribing");
            return;
        }

        res.status(201).send("CategorySubscriber created");
    }
};

export default CategorySubscriberController;