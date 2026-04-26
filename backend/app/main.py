from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .exceptions import NotFoundError
from .routers import articles, categories, interactions, recommendations, sources, users

app = FastAPI(title="AI News API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.exception_handler(NotFoundError)
async def not_found_handler(request: Request, exc: NotFoundError) -> JSONResponse:
    return JSONResponse(status_code=404, content={"detail": exc.detail})


app.include_router(articles.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(sources.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(interactions.router, prefix="/api")
app.include_router(recommendations.router, prefix="/api")


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
