#!/usr/bin/env python

"""
Automate the following tasks:
1) Copy the LICENSE.md,  CONTRIBUTORS.md and VERSION.txt files at the root of the baltek-the-program package.
2) In comments, insert or update the license & copyright Markdown text in the files of the project.
3) In about HTML files, insert or update a conversion to HTML of the license & copyright Markdown text.
4) In about HTML files, insert or update a conversion to HTML of the credits Markdown text.
5) In HTML files, insert or update the version of baltek-the-program and of baltek-the-rules.
"""

_COPYRIGHT_AND_LICENSE = """
BALTEK-THE-PROGRAM-LICENSE-MD-BEGIN
# LICENSE

[![GNU General Public License](../packages/gnu-gpl/pictures/gplv3-88x31.png)](http://www.gnu.org/licenses)

BALTEK (the program) implements BALTEK (the rules), a turn-based board game, inspired from football.

Copyright (C) 2017-2018 Lucas Borboleta ([lucas.borboleta@free.fr](mailto:lucas.borboleta@free.fr)) and Baltekians (see [CONTRIBUTORS.md](./CONTRIBUTORS.md) file).

Attribute work to URL <https://github.com/LucasBorboleta/baltek-the-program>.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses>.
BALTEK-THE-PROGRAM-LICENSE-MD-END
"""

import datetime
import os
import re
import shutil
import sys

project_home = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

tmp_path = os.path.join(project_home, "tmp")

log_path = os.path.join(tmp_path, os.path.basename(__file__) + ".log.txt")
sys.stdout = open(log_path, "w")
sys.stderr = sys.stdout

print
print "Hello " + datetime.datetime.now().isoformat()

baltek_the_program_package_path = os.path.join(project_home, "packages", "baltek-the-program")
baltek_the_program_package_html_path = os.path.join(baltek_the_program_package_path, "html")

baltek_the_program_version_txt_path = os.path.join(project_home, "docs", "VERSION.txt")
baltek_the_rules_version_txt_path = os.path.join(project_home, "packages", "baltek-the-rules", "VERSION.txt")

contributors_path = os.path.join(project_home, "docs", "CONTRIBUTORS.md")
license_md_path = os.path.join(project_home, "docs", "LICENSE.md")
credits_md_path = os.path.join(project_home, "docs", "CREDITS.md")

license_md_begin_rule = re.compile(r"^\W*BALTEK-THE-PROGRAM-LICENSE-MD-BEGIN\W*$")
license_md_end_rule = re.compile(r"^\W*BALTEK-THE-PROGRAM-LICENSE-MD-END\W*$")

license_html_begin_rule = re.compile(r"^\W*BALTEK-THE-PROGRAM-LICENSE-HTML-BEGIN\W*$")
license_html_end_rule = re.compile(r"^\W*BALTEK-THE-PROGRAM-LICENSE-HTML-END\W*$")

credits_html_begin_rule = re.compile(r"^\W*BALTEK-THE-PROGRAM-CREDITS-HTML-BEGIN\W*$")
credits_html_end_rule = re.compile(r"^\W*BALTEK-THE-PROGRAM-CREDITS-HTML-END\W*$")

baltek_the_program_version_stream = file(baltek_the_program_version_txt_path, "rU")
baltek_the_program_version = baltek_the_program_version_stream.read()
baltek_the_program_version = re.sub(r"\s+", "", baltek_the_program_version)
baltek_the_program_version_stream.close()

baltek_the_rules_version_stream = file(baltek_the_rules_version_txt_path, "rU")
baltek_the_rules_version = baltek_the_rules_version_stream.read()
baltek_the_rules_version = re.sub(r"\s+", "", baltek_the_rules_version)
baltek_the_rules_version_stream.close()

baltek_the_program_version_html_rule = re.compile(r"(?P<begin><!--\s+BALTEK-THE-PROGRAM-VERSION-HTML-BEGIN\s+-->)(?P<version>[0-9a-zA-Z.]*)(?P<end><!--\s+BALTEK-THE-PROGRAM-VERSION-HTML-END\s+-->)")
baltek_the_program_version_html_replacement = r"\g<begin>%s\g<end>" % baltek_the_program_version

baltek_the_rules_version_html_rule = re.compile(r"(?P<begin><!--\s+BALTEK-THE-RULES-VERSION-HTML-BEGIN\s+-->)(?P<version>[0-9a-zA-Z.]*)(?P<end><!--\s+BALTEK-THE-RULES-VERSION-HTML-END\s+-->)")
baltek_the_rules_version_html_replacement = r"\g<begin>%s\g<end>" % baltek_the_rules_version

excluded_dir_paths = list()
excluded_dir_paths.append(os.path.join(project_home, ".git"))
excluded_dir_paths.append(os.path.join(project_home, "docs"))
excluded_dir_paths.append(os.path.join(project_home, "packages", "baltek-the-rules"))
excluded_dir_paths.append(os.path.join(project_home, "packages", "creative-commons"))
excluded_dir_paths.append(os.path.join(project_home, "packages", "gnu-gpl"))
excluded_dir_paths.append(os.path.join(project_home, "packages", "jquery"))
excluded_dir_paths.append(os.path.join(project_home, "packages", "qunit"))
excluded_dir_paths.append(os.path.join(project_home, "packages", "togetherjs"))
excluded_dir_paths.append(os.path.join(project_home, "packages", "w3.css"))
excluded_dir_paths.append(os.path.join(project_home, "tmp"))

excluded_file_paths = list()
excluded_file_paths.append(os.path.join(project_home, ".gitattributes"))
excluded_file_paths.append(os.path.join(project_home, ".gitignore"))

excluded_file_rules = list()
excluded_file_rules.append(re.compile(r"^.*\.md$"))
excluded_file_rules.append(re.compile(r"^.*\.png$"))
excluded_file_rules.append(re.compile(r"^.*\.tmp$"))
excluded_file_rules.append(re.compile(r"^.*\.txt$"))

def convert_lines_from_md_to_html(md_lines):
    html_lines = list()

    empty_line_rule = re.compile(r"^\s*$")

    h1_line_rule = re.compile(r"^#\s+(?P<h1_title>.+)\s*$")

    h2_line_rule = re.compile(r"^##\s+(?P<h2_title>.+)\s*$")
    h2_line_replacement = r'<h2 lang="en" >\g<h2_title></h2>'

    newline_rule = re.compile(r"\n")
    newline_replacement = r' '

    image_rule = re.compile(r"!\[(?P<image_alt>[^\[\]]*)\]\((?P<image_src>[^\(\)]*)\)")
    image_replacement = r'<img lang="en" alt="\g<image_alt>" src="\g<image_src>">'

    url_rule = re.compile(r"\<(?P<url_href>[^<>]+)\>")
    url_replacement = r'[\g<url_href>](\g<url_href>)'

    link_rule = re.compile(r"\[(?P<link_text>[^\[\]]*)\]\((?P<link_href>[^\(\)]*)\)")
    link_replacement = r'<a lang="en" target="_blank" href="\g<link_href>">\g<link_text></a>'

    package_path_rule = re.compile(r'"[./]+/packages/(?P<package_name>[^"]+)"')
    package_path_replacement = r'"../../../../packages/\g<package_name>"'

    local_path_rule = re.compile(r'"[.]/(?P<file_name>[^"]+)"')
    local_path_replacement = r'"../../../../packages/baltek-the-program/\g<file_name>"'

    paragraph_begin_found = False
    paragraph_end_found = False
    paragraph_h2_found = False
    paragraph_text = ""

    # Add an empty line in order to treat the last paragraph like the previous ones.
    for md_line in md_lines + ["\n"]:
        if empty_line_rule.match(md_line):
            if paragraph_begin_found:
                paragraph_end_found = True
        elif h1_line_rule.match(md_line):
            pass
        elif h2_line_rule.match(md_line):
            paragraph_h2_found = True
            paragraph_begin_found = True
            paragraph_end_found = True
            paragraph_text += md_line
        else:
            paragraph_begin_found = True
            paragraph_text += md_line

        if paragraph_begin_found and paragraph_end_found:
            paragraph_text = newline_rule.sub(newline_replacement, paragraph_text)
            paragraph_text = url_rule.sub(url_replacement, paragraph_text)
            paragraph_text = image_rule.sub(image_replacement, paragraph_text)
            paragraph_text = link_rule.sub(link_replacement, paragraph_text)
            paragraph_text = package_path_rule.sub(package_path_replacement, paragraph_text)
            paragraph_text = local_path_rule.sub(local_path_replacement, paragraph_text)

            if paragraph_h2_found:
                paragraph_text = h2_line_rule.sub(h2_line_replacement, paragraph_text)
                paragraph_text = '\n' + paragraph_text + '\n\n'

            else:
                paragraph_text = '<p lang="en" >' + paragraph_text + '</p>\n'

            html_lines.append(paragraph_text)

            paragraph_begin_found = False
            paragraph_end_found = False
            paragraph_h2_found = False
            paragraph_text = ""

    return html_lines

license_md_stream = file(license_md_path, "rU")
license_md_lines = license_md_stream.readlines()
license_md_stream.close()

credits_md_stream = file(credits_md_path, "rU")
credits_md_lines = credits_md_stream.readlines()
credits_md_stream.close()

license_html_lines = convert_lines_from_md_to_html(license_md_lines)
credits_html_lines = convert_lines_from_md_to_html(credits_md_lines)

file_paths = list()

for (dir_path, dir_names, file_names) in os.walk(project_home):
    dont_walk_items = list()
    for item in dir_names:
        if os.path.join(dir_path, item) in excluded_dir_paths:
            dont_walk_items.append(item)
    for item in dont_walk_items:
        dir_names.remove(item)

    if not dir_path in excluded_dir_paths:
        for file_name in file_names:
            file_path = os.path.join(dir_path, file_name)
            if not file_path in excluded_file_paths:
                file_rule_is_matched = False
                for file_rule in excluded_file_rules:
                    if file_rule.match(file_path):
                        file_rule_is_matched = True
                        break
                if not file_rule_is_matched:
                    file_paths.append(file_path)

failed_file_paths = list()

for file_path in file_paths:
    print
    print "updating file '%s' ..." % file_path
    file_stream = file(file_path, "rU")
    file_lines = file_stream.readlines()
    file_stream.close()

    udpated_lines = list()

    license_md_begin_found = False
    license_md_end_found = False
    license_md_error = False

    license_html_begin_found = False
    license_html_end_found = False
    license_html_error = False

    credits_html_begin_found = False
    credits_html_end_found = False
    credits_html_error = False

    for line in file_lines:
        line = baltek_the_program_version_html_rule.sub(baltek_the_program_version_html_replacement, line)
        line = baltek_the_rules_version_html_rule.sub(baltek_the_rules_version_html_replacement, line)

        license_md_begin_match = license_md_begin_rule.match(line)
        license_md_end_match = license_md_end_rule.match(line)

        license_html_begin_match = license_html_begin_rule.match(line)
        license_html_end_match = license_html_end_rule.match(line)

        credits_html_begin_match = credits_html_begin_rule.match(line)
        credits_html_end_match = credits_html_end_rule.match(line)

        if license_md_begin_match:
            if license_md_begin_found:
                license_md_error = True
                print "error: license_md_begin_match matched more than one time"
            elif license_md_end_found:
                license_md_error = True
                print "error: license_md_begin_match matched after license_md_end_match"
            else:
                license_md_begin_found = True
                udpated_lines.append(line)
                udpated_lines.extend(license_md_lines)

        if license_html_begin_match:
            # the relative path of license_html_lines have been prepared for the HTML rules only !
            assert os.path.dirname(os.path.dirname(file_path)) == baltek_the_program_package_html_path

            if license_html_begin_found:
                license_html_error = True
                print "error: license_html_begin_match matched more than one time"
            elif license_html_end_found:
                license_html_error = True
                print "error: license_html_begin_match matched after license_html_end_match"
            else:
                license_html_begin_found = True
                udpated_lines.append(line)
                udpated_lines.extend(license_html_lines)

        if credits_html_begin_match:
            # the relative path of credits_html_lines have been prepared for the HTML rules only !
            assert os.path.dirname(os.path.dirname(file_path)) == baltek_the_program_package_html_path

            if credits_html_begin_found:
                credits_html_error = True
                print "error: credits_html_begin_match matched more than one time"
            elif credits_html_end_found:
                credits_html_error = True
                print "error: credits_html_begin_match matched after credits_html_end_match"
            else:
                credits_html_begin_found = True
                udpated_lines.append(line)
                udpated_lines.extend(credits_html_lines)

        if license_md_end_match:
            if license_md_end_found:
                license_md_error = True
                print "error: license_md_end_match matched more than one time"
            elif not license_md_begin_found:
                license_md_error = True
                print "error: license_md_end_match matched before license_md_begin_match"
            else:
                license_md_end_found = True
                udpated_lines.append(line)

        if license_html_end_match:
            if license_html_end_found:
                license_html_error = True
                print "error: license_html_end_match matched more than one time"
            elif not license_html_begin_found:
                license_html_error = True
                print "error: license_html_end_match matched before license_html_begin_match"
            else:
                license_html_end_found = True
                udpated_lines.append(line)

        if credits_html_end_match:
            if credits_html_end_found:
                credits_html_error = True
                print "error: credits_html_end_match matched more than one time"
            elif not credits_html_begin_found:
                credits_html_error = True
                print "error: credits_html_end_match matched before credits_html_begin_match"
            else:
                credits_html_end_found = True
                udpated_lines.append(line)

        if not (license_md_begin_match or license_md_end_match or
                license_html_begin_match or license_html_end_match or
                credits_html_begin_match or credits_html_end_match ):
            if not( (license_md_begin_found != license_md_end_found) or
                (license_html_begin_found != license_html_end_found) or
                (credits_html_begin_found != credits_html_end_found)  ):
                udpated_lines.append(line)

    if not (license_md_begin_found and license_md_end_found):
        license_md_error = True
        print "error: not both license_md_begin_match and license_md_end_match"

    if not (license_html_begin_found == license_html_end_found):
        # HTML licences tags are not mandatory
        license_html_error = True
        print "error: not both license_html_begin_match and license_html_end_match"

    if not (credits_html_begin_found == credits_html_end_found):
        # HTML credits tags are not mandatory
        credits_html_error = True
        print "error: not both credits_html_begin_match and credits_html_end_match"

    if not (license_md_error or license_html_error or credits_html_error):
        file_stream = file(file_path, "w")
        file_stream.writelines(udpated_lines)
        file_stream.close()
        print "updating file '%s' done" % file_path
    else:
        failed_file_paths.append(file_path)
        print "updating file '%s' failed !!!" % file_path

if len(failed_file_paths) != 0:
    print
    print "Update failed for the following files:"
    for file_path in failed_file_paths:
        print file_path

for file_path in [license_md_path, contributors_path, baltek_the_program_version_txt_path]:
    shutil.copyfile(file_path, os.path.join(baltek_the_program_package_path, os.path.basename(file_path)))
    print
    print "copying file '%s' in '%s' ..." % (file_path, baltek_the_program_package_path)
    print "copying file done"

print
print "Bye " + datetime.datetime.now().isoformat()


if len(failed_file_paths) == 0:
    sys.exit(0)
else:
    sys.exit(1)
