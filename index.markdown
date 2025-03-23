---
layout: default
title: Atomic Tomorrow Adventures
---

# Welcome to Atomic Tomorrow Adventures

## Rules

{% for rule in site.rules %}

- [{{ rule.title | default: rule.path | split: '/' | last | remove: '.md' }}]({{ site.baseurl }}{{ rule.url }})
{% endfor %}

## Setting

{% for setting in site.setting %}

- [{{ setting.title | default: setting.path | split: '/' | last | remove: '.md' }}]({{ site.baseurl }}{{ setting.url }})
{% endfor %}

---
