import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn,
    OneToMany 
  } from 'typeorm';
  import { ExpenseItem } from '../expense-items/expense-items.entity';
  
  @Entity('expenses')
  export class Expense {
    @PrimaryGeneratedColumn()
    expenseId: number;
  
    @Column()
    customerId: number;
  
    @Column()
    expenseTypeId: number;
  
    @Column({ type: 'datetime' })
    expenseDate: Date;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    expenseDiscount: number;
  
    @Column()
    expenseStatusId: number;
  
    @Column({ type: 'text', nullable: true })
    expenseNotes: string;
  
    @Column()
    createdBy: number;
  
    @Column({ nullable: true })
    modifiedBy: number;
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    modifiedDate: Date;
  
    @OneToMany(() => ExpenseItem, expenseItem => expenseItem.expense)
    expenseItems: ExpenseItem[];
  }