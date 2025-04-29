import {
    PrimaryGeneratedColumn, CreateDateColumn,
    UpdateDateColumn, BaseEntity, BeforeInsert
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export abstract class AbstractEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    generateId() {
        this.id = uuidv4();
    }
}
