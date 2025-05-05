import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesModel } from './workspaces.model';
import { AuthModule } from '~/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [WorkspacesController],
  providers: [WorkspacesService, WorkspacesModel],
  exports: [WorkspacesService],
})
export class WorkspacesModule {}
