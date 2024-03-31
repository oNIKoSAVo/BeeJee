"""add column

Revision ID: 455655b87225
Revises: 
Create Date: 2024-03-31 14:04:00.419236

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '455655b87225'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('to_do', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_name', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('email', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('edited_by_admin', sa.Boolean(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('to_do', schema=None) as batch_op:
        batch_op.drop_column('edited_by_admin')
        batch_op.drop_column('email')
        batch_op.drop_column('user_name')

    # ### end Alembic commands ###
