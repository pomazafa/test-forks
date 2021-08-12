import { Request, Response } from "express";
import { getRepository, createQueryBuilder } from "typeorm";
import { validate } from "class-validator";

import { Category } from "../entity/Category";
import { Fork } from "../entity/Fork";

class CategoryController {

    static listAll = async (req: Request, res: Response) => {
        const categoryRepository = getRepository(Category);
        const categories = await categoryRepository.find({
            select: ["id", "name", "description"]
        });

        res.send(categories);
    };

    static listAllForks = async (req: Request, res: Response) => {


        const query = createQueryBuilder('Fork', 'f')
            .innerJoin('f.category', 'c')
            .select(['f'])
            .where("c.id = :categoryId", { categoryId: req.params && req.params.id });

        const categories = await query.getMany();
        res.send(categories);
    };

    static getOneById = async (id: number) => {

        const categoryRepository = getRepository(Category);
        try {
            const category = await categoryRepository.findOneOrFail(id, {
                select: ["id", "name", "description"]
            });
            return category;

        } catch (error) {
            return null;
        }

    };

    static newCategory = async (req: Request, res: Response) => {
        let { name, description, year } = req.body;
        let category = new Category();
        category.name = name;
        category.description = description;

        const errors = await validate(category);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const categoryRepository = getRepository(Category);
        try {
            await categoryRepository.save(category);
        } catch (e) {
            res.status(409).send("such category name already exists");
            return;
        }

        res.status(201).send("Category created");
    }
};

export default CategoryController;