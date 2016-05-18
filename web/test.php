<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 9/19/15
 * Time: 2:59 PM
 */

// The "i" after the pattern delimiter indicates a case-insensitive search
if (preg_match("/php/i", "dsPhPis the web scripting language of choice.")) {
    echo "A match was found.";
} else {
    echo "A match was not found.";
}