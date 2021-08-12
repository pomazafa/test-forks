import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { User } from "../entity/User";
import { Category } from "../entity/Category";

@Entity()
export class CategorySubscriber {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(type => User, user => user.forks)
    user: User;

    @ManyToOne(type => Category, category => category.forks)
    category: Category;
}