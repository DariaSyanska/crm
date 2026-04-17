from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.dependencies import get_current_user
from app.access import get_client_or_404, check_client_access, get_task_or_404

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("/", response_model=TaskResponse)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    task_data = task.model_dump()

    if task.client_id is not None:
        client = get_client_or_404(db, task.client_id)
        check_client_access(client, current_user)

    if current_user.role != "admin":
        task_data["user_id"] = current_user.id

    db_task = Task(**task_data)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


@router.get("/", response_model=list[TaskResponse])
def list_tasks(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role == "admin":
        return db.query(Task).all()

    return db.query(Task).filter(Task.user_id == current_user.id).all()


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    task = get_task_or_404(db, task_id)

    if current_user.role != "admin" and task.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    if task.client_id is not None:
        client = get_client_or_404(db, task.client_id)
        check_client_access(client, current_user)

    return task


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    task = get_task_or_404(db, task_id)

    if current_user.role != "admin" and task.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    update_data = data.model_dump(exclude_unset=True)

    if "client_id" in update_data and update_data["client_id"] is not None:
        client = get_client_or_404(db, update_data["client_id"])
        check_client_access(client, current_user)

    if current_user.role != "admin":
        update_data["user_id"] = current_user.id

    for field, value in update_data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    task = get_task_or_404(db, task_id)

    if current_user.role != "admin" and task.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}