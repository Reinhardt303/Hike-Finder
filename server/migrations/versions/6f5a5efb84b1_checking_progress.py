"""checking progress

Revision ID: 6f5a5efb84b1
Revises: 14e362d91cf0
Create Date: 2025-05-26 16:59:51.354834

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6f5a5efb84b1'
down_revision = '14e362d91cf0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('hikers', schema=None) as batch_op:
        batch_op.drop_column('_password_hash')

    with op.batch_alter_table('hikes', schema=None) as batch_op:
        batch_op.alter_column('name',
               existing_type=sa.VARCHAR(),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('hikes', schema=None) as batch_op:
        batch_op.alter_column('name',
               existing_type=sa.VARCHAR(),
               nullable=False)

    with op.batch_alter_table('hikers', schema=None) as batch_op:
        batch_op.add_column(sa.Column('_password_hash', sa.VARCHAR(), nullable=True))

    # ### end Alembic commands ###
