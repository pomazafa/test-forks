import { Request, Response } from "express";
import { createQueryBuilder, getRepository } from "typeorm";
import { validate } from "class-validator";

import { CategorySubscriber } from "../entity/CategorySubscriber";

class CategorySubscriberController {

    static listAll = async (req: Request, res: Response) => {
        const query = createQueryBuilder('CategorySubscriber', 's')
            .innerJoin('s.user', 'u')
            .innerJoin('s.category', 'c')
            .select(['s', 'c', 'u.id', 'u.email', 'u.username'])
            .where("c.id = :categoryId", { categoryId: req.params && req.params.id });
        const categorySubscribers = await query.getMany();

        res.send(categorySubscribers);
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