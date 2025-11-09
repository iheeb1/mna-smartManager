import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
  } from 'typeorm';
  import { Expense } from '../expenses/expenses.entity';
  
  @Entity('expense_items')
  export class ExpenseItem {
    @PrimaryGeneratedColumn()
    expenseItemId: number;
  
    @Column()
    expenseId: number;
  
    @Column()
    expenseItemMethodId: number;
  
    @Column({ nullable: true })
    expenseItemBankId: number;
  
    @Column({ nullable: true })
    expenseItemBankAccountNumber: string;
  
    @Column({ nullable: true })
    expenseItemBankBranchNumber: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    expenseItemAmount: number;
  
    @Column({ nullable: true })
    expenseItemCheckNumber: string;
  
    @Column({ type: 'datetime', nullable: true })
    expenseItemCheckDueDate: Date;
  
    @Column({ nullable: true })
    expenseItemCheckStatusId: number;
  
    @Column({ nullable: true })
    expenseItemReference: string;
  
    @Column()
    expenseItemStatusId: number;
  
    @Column({ type: 'text', nullable: true })
    expenseItemNotes: string;
  
    @Column()
    createdBy: number;
  
    @Column({ nullable: true })
    modifiedBy: number;
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    modifiedDate: Date;
  
    @ManyToOne(() => Expense, expense => expense.expenseItems)
    @JoinColumn({ name: 'expenseId' })
    expense: Expense;
  }