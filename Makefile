TEMPLATE_REPO ?= https://github.com/JustSereja/morethan-log-astro.git
TEMPLATE_BRANCH ?= main
TEMPLATE_TMP ?= .template-update

.PHONY: update-template

## Pulls the latest template without touching content/config overrides.
update-template:
	@set -e; \
	if ! command -v git >/dev/null 2>&1; then \
		echo "git is required to run update-template" >&2; \
		exit 1; \
	fi; \
	if ! command -v rsync >/dev/null 2>&1; then \
		echo "rsync is required to run update-template" >&2; \
		exit 1; \
	fi; \
	echo "Cloning template from $(TEMPLATE_REPO)#$(TEMPLATE_BRANCH)..."; \
	rm -rf $(TEMPLATE_TMP); \
	git clone --depth=1 --branch $(TEMPLATE_BRANCH) $(TEMPLATE_REPO) $(TEMPLATE_TMP); \
	echo "Syncing template files (keeping your content and config untouched)..."; \
	rsync -a \
		--exclude '.git/' \
		--exclude '.github/' \
		--exclude '.astro/' \
		--exclude '.template-update/' \
		--exclude 'README.md' \
		--exclude 'screenshot.*' \
		--exclude 'node_modules/' \
		--exclude 'dist/' \
		--exclude '.DS_Store' \
		--exclude '.env' \
		--exclude '.env.*' \
		--exclude 'src/content/' \
		--exclude 'src/config/site.ts' \
		--exclude 'public/img/' \
		--exclude 'public/favicon*' \
		$(TEMPLATE_TMP)/ ./; \
	rm -rf $(TEMPLATE_TMP); \
	echo ""; \
	echo "Template update complete."; \
	echo "Review the pending changes with 'git status' and resolve conflicts before committing."
