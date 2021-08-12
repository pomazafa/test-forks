import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { IsNotEmpty, Length } from "class-validator";
import { User } from "../entity/User";
import { Category } from "../entity/Category";

@Entity()
export class Fork {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(6, 50)
    @IsNotEmpty({ message: 'The name is required' })
    name: string;

    @Column()
    @Length(10, 100, { message: 'The description must be at least 10 but not longer than 100 characters' })
    @IsNotEmpty({ message: 'The description is required' })
    description: string;

    @Column()
    @IsNotEmpty({ message: 'The year is required' })
    year: number;

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