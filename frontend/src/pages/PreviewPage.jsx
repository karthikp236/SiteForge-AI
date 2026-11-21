
import React, { useEffect, useState } from "react";
import { previewPageStyles as s } from "../assets/dummyStyles";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Heart,
  Loader2,
  Sparkles,
} from "lucide-react";
import { FullScreenMessage, Logo } from "../assets/ui";
import { useAuth } from "../context/AuthContext";
import {
  apiError,
  getCommunityProject,
  getProject,
  likeCommunityProject,
} from "../utils/api";
import { safePreviewHtml } from "../utils/safePreview";

const PreviewPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liking, setLiking] = useState(false);
  const [actionError, setActionError] = useState("");
  const [liked, setLiked] = useState(false);

  // Load project preview
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const { project: p } = await getCommunityProject(id);

        if (!cancelled) {
          setProject(p);
          setLiked(Boolean(p.liked));
        }
      } catch {
        if (user) {
          try {
            const { project: p } = await getProject(id);

            if (!cancelled) {
              setProject(p);
              setLiked(Boolean(p.liked));
            }
          } catch (err) {
            if (!cancelled) {
              setError(apiError(err));
            }
          }
        } else if (!cancelled) {
          setError("This preview isn't public yet.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id, user]);

  // Like or unlike project
  async function handleLike() {
    if (!project || liking) return;

    setLiking(true);
    setActionError("");

    try {
      const result = await likeCommunityProject(project.id);

      setProject((previous) => ({
        ...previous,
        likes: result.likes,
      }));

      setLiked(Boolean(result.liked));
    } catch (err) {
      setActionError(apiError(err));
      console.error("Like project error:", err);
    } finally {
      setLiking(false);
    }
  }

  if (loading) {
    return (
      <FullScreenMessage>
        <Loader2 className={s.loadingSpinner} />
        Loading preview...
      </FullScreenMessage>
    );
  }

  if (error || !project) {
    return (
      <FullScreenMessage>
        <p className={s.errorTitle}>Preview unavailable</p>

        <p className={s.errorMessage}>
          {error || "Project not found"}
        </p>

        <Link to="/community" className={s.errorButton}>
          <ArrowLeft className="w-3.5 h-3.5" />
          Browse community
        </Link>
      </FullScreenMessage>
    );
  }

  return (
    <div className={s.container}>
      <header className={s.header}>
        <Link to="/community" className={s.backLink}>
          <ArrowLeft className={s.backIcon} />
          Community
        </Link>

        <div className={s.logoWrapper}>
          <Logo />
        </div>

        <div className={s.projectInfo}>
          <p className={s.projectName}>
            {project.name}
          </p>

          <p className={s.projectAuthor}>
            by {project.author || "Anonymous"}
          </p>
        </div>

        <div className={s.actions}>
          <span className={s.viewsBadge}>
            <Eye className={s.viewsIcon} />
            {project.views ?? 0}
          </span>

          <button
            type="button"
            onClick={handleLike}
            disabled={liking}
            className={s.likeButton}
            aria-label={liked ? "Unlike project" : "Like project"}
          >
            <Heart
              className={s.likeIcon}
              fill={liked ? "currentColor" : "none"}
            />

            {project.likes ?? 0}
          </button>
        </div>
      </header>

      {actionError && (
        <p role="alert" className={s.errorMessage}>
          {actionError}
        </p>
      )}

      <div className={s.previewArea}>
        {project.html ? (
          <iframe
            title={project.name}
            srcDoc={safePreviewHtml(project.html)}
            sandbox="allow-scripts allow-same-origin allow-modals allow-popups"
            className={s.iframe}
          />
        ) : (
          <div className={s.emptyContainer}>
            <Sparkles className={s.emptyIcon} />
            This project has no generated HTML yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPage;
