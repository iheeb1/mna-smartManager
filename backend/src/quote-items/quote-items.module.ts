import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuoteItemsController } from './quote-items.controller';
import { QuoteItemsService } from './quote-items.service';
import { QuoteItem } from './quote-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuoteItem])],
  controllers: [QuoteItemsController],
  providers: [QuoteItemsService],
  exports: [QuoteItemsService],
})
export class QuoteItemsModule {}